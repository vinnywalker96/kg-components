
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import RequireAuth from "@/components/auth/RequireAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

const Account = () => {
  const { profile, isLoading, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateProfile({
      full_name: fullName,
      address,
      phone,
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50 border-b">
              <Skeleton className="h-10 w-1/2" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center mb-6">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-28 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50 border-b">
              <CardTitle className="text-xl">My Account</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-center mb-8">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your shipping address"
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Account;
