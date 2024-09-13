"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NewPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function NewPasswordForm({ className, ...props }: NewPasswordFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match!")
            return
        }

        setError(null)
        const formData = {
            password,
            confirmPassword
        }

        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log("Form Data:", formData)
            // Assuming successful password reset, redirect to SignIn
            router.push('/auth/SignIn')
        } catch (error) {
            console.error("Submission error", error)
            setError("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter Your Password"
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className="pr-10 w-full"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm Your Password"
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className="pr-10 w-full"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm" aria-live="assertive">
                                {error}
                            </div>
                        )}
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && (
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                             Submit
                        </Button>
                    </div>
                </div>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
                <span>
                Don&apos;thave an account? <Link href={'/auth/Register'} className="text-black font-semibold underline">
                        Register
                    </Link>
                </span>
            </p>
        </div>
    )
}
