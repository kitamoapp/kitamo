
'use client';

import { referredUsers } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMemo } from 'react';

export function ReferredUsersTable() {
  const allUserReferrals = useMemo(() => {
    const direct = referredUsers
      .filter((u) => u.referredBy === 'currentUser')
      .map((u) => ({ ...u, tier: 1 }));

    const indirect = direct
      .map((directReferral) =>
        referredUsers
          .filter((u) => u.referredBy === directReferral.id)
          .map((u) => ({ ...u, tier: 2 }))
      )
      .flat();

    return [...direct, ...indirect];
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referred Users</CardTitle>
        <CardDescription>
          Here's a list of users in your referral network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Sign-up Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUserReferrals.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={`https://picsum.photos/100/100?random=${'user.id'}`}
                        alt={user.name}
                        data-ai-hint="person portrait"
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.signupDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300'
                    )}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.tier === 1 ? 'Direct' : 'Indirect'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
