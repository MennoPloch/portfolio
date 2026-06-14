import { supabase } from '../lib/supabase'

export function useAnalytics() {
    const shouldLogAnalyticsErrors = import.meta.env.DEV

    const logEvent = async (name: string, metadata: object = {}) => {
        try {
            const { error } = await supabase
                .from('analytics_logs')
                .insert({
                    event_name: name,
                    metadata: metadata,
                    url: window.location.href,
                    referrer: document.referrer,
                    user_agent: navigator.userAgent,
                    timestamp: new Date().toISOString()
            })

            if (error) {
                if (shouldLogAnalyticsErrors) {
                    console.warn('Error logging analytics event:', error)
                }
            }
        } catch (err) {
            if (shouldLogAnalyticsErrors) {
                console.warn('Unexpected error logging analytics event:', err)
            }
        }
    }

    const logPageView = async (path: string) => {
        await logEvent('page_view', { path })
    }

    return {
        logEvent,
        logPageView
    }
}
