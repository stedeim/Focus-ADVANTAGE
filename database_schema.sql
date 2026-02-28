-- Focus Advantage Database Schema Updates
-- Copy and execute this in your PostgreSQL environment

-- 1. Update Users Table with Activity Tracking Fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_focus_block_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_circle_checkin_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_focus_blocks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'recruit',
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_reengagement_email_at TIMESTAMP WITH TIME ZONE;

-- 2. Create Email Queue Table
CREATE TABLE IF NOT EXISTS email_queue (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}' -- Store personalization data
);

-- 3. Create Email Logs Table
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,
    error_message TEXT,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    tracking_id UUID DEFAULT gen_random_uuid()
);

-- 4. Re-engagement Detection Function
CREATE OR REPLACE FUNCTION detect_and_queue_reengagement_emails()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    days_inactive INTEGER;
    template_to_use TEXT;
    user_metadata JSONB;
BEGIN
    FOR user_record IN 
        SELECT u.id, u.last_login_at, u.timezone, u.last_reengagement_email_at, u.current_streak,
               (SELECT count(*) FROM users) as circle_count -- Mock circle count
        FROM users u
        WHERE u.email_notifications_enabled = TRUE
    LOOP
        -- Calculate days since last login
        days_inactive := DATE_PART('day', NOW() - user_record.last_login_at);
        
        -- Determine template based on inactivity milestones
        IF days_inactive = 7 THEN 
            template_to_use := 'reengagement_7d';
            user_metadata := jsonb_build_object('streak', user_record.current_streak);
        ELSIF days_inactive = 14 THEN 
            template_to_use := 'reengagement_14d';
            user_metadata := jsonb_build_object('circle_name', 'The Q4 Finishers', 'member_count', user_record.circle_count);
        ELSIF days_inactive = 21 THEN 
            template_to_use := 'reengagement_21d';
            user_metadata := '{}'::jsonb;
        ELSIF days_inactive = 30 THEN 
            template_to_use := 'reengagement_30d';
            user_metadata := '{}'::jsonb;
        ELSE 
            template_to_use := NULL;
        END IF;

        -- Queue email if milestone hit and not already sent today
        IF template_to_use IS NOT NULL AND 
           (user_record.last_reengagement_email_at IS NULL OR 
            user_record.last_reengagement_email_at < CURRENT_DATE) THEN
            
            INSERT INTO email_queue (user_id, template_id, scheduled_for, metadata)
            VALUES (
                user_record.id, 
                template_to_use, 
                (CURRENT_DATE + TIME '09:00:00') AT TIME ZONE user_record.timezone,
                user_metadata
            );

            UPDATE users 
            SET last_reengagement_email_at = NOW() 
            WHERE id = user_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. Schedule Daily Job (Requires pg_cron extension)
-- SELECT cron.schedule('0 6 * * *', 'SELECT detect_and_queue_reengagement_emails()');
