'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.replace('/login') // or wherever you want after logout
    }

    return (
        <Button variant="outline" onClick={handleLogout}>
            Log Out
        </Button>
    )
}
