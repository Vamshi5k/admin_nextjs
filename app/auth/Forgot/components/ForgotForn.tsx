"use client"

import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"
import Google from "../../../../img/Google.png"
import Apple from "../../../../img/apple-logo.png"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

interface ForgetFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function ForgetForm({ className, ...props }: ForgetFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [showOTPDialog, setShowOTPDialog] = useState<boolean>(false)
    const router = useRouter()

    const ModalCloseHandler = () => {
        setShowOTPDialog(false);
        router.push('/auth/NewPassword')
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = {
            email,
        }

        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log("Form Data:", formData)
            
            setShowOTPDialog(true)
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
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Verify Email
                    </Button>
                </div>
            </form>

            <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
                <DialogTrigger asChild>
                    <Button type="button" style={{ display: 'none' }} />
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader className="mb-5">
                        <DialogTitle>OTP Verification</DialogTitle>
                        <DialogDescription>
                            We have sent an OTP to your email address.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center">
                        <InputOTP maxLength={4}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => ModalCloseHandler()}>Verify</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

         
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
