'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { format } from 'date-fns';
import { Ban, CheckCircle, Trash2 } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string;
  address?: string;
}

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  createdAt: string;
  profile: UserProfile;
}

interface UsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async (pageNum: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user?page=${pageNum}&limit=10`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data: UsersResponse = await response.json();

      if (data.data) {
        if (pageNum === 1) {
          setUsers(data.data);
        } else {
          setUsers((prev) => [...prev, ...data.data]);
        }
        setHasMore(data.data.length === 10);
      }
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'BLOCKED' | 'DELETED') => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Update user status in local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );

      toast.success(`User ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user status');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'VENDOR':
        return 'bg-blue-100 text-blue-800';
      case 'CUSTOMER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'BLOCKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      {user.profile.profilePhoto && (
                        <Image
                          src={user.profile.profilePhoto}
                          alt={user.profile.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{user.profile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.profile.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  {user.status === 'ACTIVE' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleStatusChange(user.id, 'BLOCKED')}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block
                    </Button>
                  ) : user.status === 'BLOCKED' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Restore
                    </Button>
                  )}
                  {user.status !== 'DELETED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 ml-2"
                      onClick={() => handleStatusChange(user.id, 'DELETED')}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Load More Users
          </Button>
        </div>
      )}
    </div>
  );
} 