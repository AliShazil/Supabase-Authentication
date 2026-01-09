'use client'

import { useState, useTransition } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signup } from '@/app/(authentication)/signin/actions'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, Mail } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
})

export function SignupForm({ className, ...props }) {
    const [isPending, startTransition] = useTransition()
    const [showEmailForm, setShowEmailForm] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = (values) => {
        startTransition(() => {
            const formData = new FormData()
            formData.append('email', values.email)
            formData.append('password', values.password)
            signup(formData)
        })
    }

    const signupWithGoogle = async () => {
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Google Sign-In Error:', error.message)
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create an account</CardTitle>
                    <CardDescription>
                        Sign up quickly with Google or use your email
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {!showEmailForm ? (
                        <div className="space-y-6">

                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => setShowEmailForm(true)}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Sign up with Email
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowEmailForm(false)}
                                    className="p-0 h-auto"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="m@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating your account...
                                            </>
                                        ) : (
                                            <>
                                                Sign up <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center text-sm">
                                        Already have an account?{' '}
                                        <Link href="/login" className="underline underline-offset-4">
                                            Log in
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By signing up, you agree to our{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}