"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  signIn,
  type AuthActionState,
} from "@/features/admin/actions/auth";

const initialState: AuthActionState = {};

export function LoginForm({
  className,
  initialError,
  ...props
}: React.ComponentProps<"div"> & { initialError?: string }) {
  const [state, formAction, isPending] = useActionState(signIn, {
    ...initialState,
    error: initialError,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Arteesans Admin</CardTitle>
          <CardDescription>
            Sign in with your admin account to manage requests and artisans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@arteesans.ng"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              {state.error ? (
                <p className="text-sm text-destructive">{state.error}</p>
              ) : null}
              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? <Spinner className="size-4" /> : "Sign in"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
