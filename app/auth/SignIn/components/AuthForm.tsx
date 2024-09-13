"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Google from "../../../../img/Google.png"
import Apple from "../../../../img/apple-logo.png"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    // const [rememberMe, setRememberMe] = useState<boolean>(false)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = {
            email,
            password
        }


        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 3000))
            console.log("Form Data:", formData)
            router.push('/');
        } catch (error) {
            console.error("Submission error", error)
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="Enter Your Email Address"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="relative flex flex-col gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter Your Password"
                                    autoCapitalize="none"
                                    autoComplete="current-password"
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
                                        <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                        <div className="flex items-center gap-2">
                            <Checkbox id="rememberMe" />
                            <label
                                htmlFor="rememberMe"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember Me
                            </label>
                        </div>
                        <Link href={'/auth/Forgot'} className="text-sm text-black hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login
                    </Button>
                </div>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
                <span>
                Don&apos;t have an account? <Link href={'/auth/Register'} className="text-black font-semibold underline">
                        Register
                    </Link>
                </span>
            </p>
        </div>
    )
}
