"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function RegisterForm({ className, ...props }: RegisterFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("") 
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match!")
            return
        }

        setError(null)
        const formData = {
            name,
            email,
            password,
            confirmPassword,
            userType: selectedType, 
        }

        setIsLoading(true)

        try {
            console.log("Form Data:", formData)
            toast({
                description: "Account Created Successfully",
                variant: "default",
            })
            router.push('/auth/SignIn')
        } catch (error) {
            console.error("Submission error", error)
            toast({
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Enter Your Name"
                        autoCapitalize="none"
                        autoComplete="name"
                        autoCorrect="off"
                        disabled={isLoading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col gap-4">
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
                <div className="relative flex flex-col gap-4">
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
                                <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="relative flex flex-col gap-4">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="Confirm Your Password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="pr-10 w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="relative flex flex-col gap-4">
                    <Label htmlFor="userType">Select Type</Label>
                    <Select onValueChange={(value) => setSelectedType(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="freelancer">Freelancer</SelectItem>
                                <SelectItem value="studio">Studio</SelectItem>
                                <SelectItem value="themepark">ThemePark</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {error && (
                    <div className="text-red-500 text-sm mt-2" aria-live="assertive">
                        {error}
                    </div>
                )}
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
                <span>
                    Already a Member?{" "}
                    <Link href="/auth/SignIn" className="text-black font-semibold underline">
                        Sign In
                    </Link>
                </span>
            </p>
        </div>
    )
}
