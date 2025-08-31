
'use client';

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
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useReferredUsers } from '@/context/referred-user-context';

export function ReferredUsersTable() {
  const { referredUsers } = useReferredUsers();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Referred Users</CardTitle>
        <CardDescription>
          Here's a list of users you have directly referred into your network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Sign-up Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Leg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referredUsers
              .filter((u) => u.referredBy === 'currentUser')
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`https://picsum.photos/100/100?random=${user.id}`}
                          alt={user.name}
                          data-ai-hint="person portrait"
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.signupDate.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        user.plan === 'Platinum' &&
                          'border-sky-500 text-sky-500',
                        user.plan === 'Gold' &&
                          'border-amber-500 text-amber-500',
                        user.plan === 'Silver' &&
                          'border-slate-500 text-slate-500'
                      )}
                    >
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.leg === 'left' ? (
                        <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">{user.leg}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
