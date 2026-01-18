import { supabase } from '../lib/supabase'

export function useAnalytics() {
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
                console.error('Error logging event:', error)
            }
        } catch (err) {
            console.error('Unexpected error logging event:', err)
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
