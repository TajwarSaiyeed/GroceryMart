"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfileInfo } from "@/actions/get-profile-info";

interface ProfileInfo {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  balance: number;
}

export function ProfileInformation() {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileInfo = async () => {
      try {
        const data = await getProfileInfo();
        setProfileInfo(data);
      } catch (error) {
        console.error("Failed to fetch profile information:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileInfo();
  }, []);

  if (isLoading) {
    return <ProfileInfoSkeleton />;
  }

  if (!profileInfo) {
    return <div>Failed to load profile information.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your personal and account details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Username
            </h3>
            <p className="text-lg font-semibold">{profileInfo.username}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p className="text-lg">
              {profileInfo.first_name} {profileInfo.last_name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{profileInfo.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
            <p className="text-lg">{profileInfo.mobile_no}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Balance
            </h3>
            <p className="text-lg">{profileInfo.balance}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-6 w-[200px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
