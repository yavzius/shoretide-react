import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { UserPlus, Users, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/use-workspace";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UserFormData {
  email: string;
  firstName: string;
  lastName?: string;
  role: 'admin' | 'agent';
}

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string | null;  // From accounts_users table
}

export default function Settings() {
  const { workspace } = useWorkspace();
  const [aiEnabled, setAiEnabled] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("agent");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [userToManage, setUserToManage] = useState<User | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'agent'>('agent');

  const fetchUsers = async () => {
    if (!workspace) return;
    
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('accounts_users')
        .select(`
          user_id,
          role,
          users:user_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('account_id', workspace.id);

      if (error) {
        toast.error("Failed to fetch users");
        console.error(error);
        return;
      }
      
      setUsers(data?.map(record => ({
        id: record.users.id,
        first_name: record.users.first_name,
        last_name: record.users.last_name,
        email: record.users.email,
        role: record.role
      })) || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (workspace) {
      fetchUsers();

      // Set up real-time subscription
      const usersSubscription = supabase
        .channel('accounts_users_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'accounts_users',
            filter: `account_id=eq.${workspace.id}`
          },
          () => {
            // Refresh the users list when changes occur
            fetchUsers();
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        usersSubscription.unsubscribe();
      };
    }
  }, [workspace]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && workspace) {
        const { data } = await supabase
          .from('accounts_users')
          .select('role')
          .eq('user_id', user.id)
          .eq('account_id', workspace.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    };
    checkAdminStatus();
  }, [workspace]);

  const form = useForm<UserFormData>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "agent",
    },
  });

  const onSubmit = async (formData: UserFormData) => {
    if (!isAdmin) {
      toast.error("Only admins can invite users");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Verify admin status and workspace
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !workspace) {
        toast.error("Missing user or workspace information");
        return;
      }

      // 2. Call create-user Edge Function
      const response = await supabase.functions.invoke('create-user', {
        body: {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          account_id: workspace.id
        }
      });

      if (response.error) {
        // Try to parse the error response
        let errorMessage = "Failed to create user";
        try {
          const errorContext = JSON.parse(response.error.message);
          errorMessage = errorContext.error || errorContext.message || response.error.message;
        } catch {
          errorMessage = response.error.message || errorMessage;
        }

        if (errorMessage.includes("email_exists") || errorMessage.includes("already been registered")) {
          toast.error("A user with this email already exists");
        } else {
          toast.error(errorMessage);
        }
        console.error('Edge Function Error:', response.error);
        return;
      }

      // Success handling
      toast.success("User added successfully");
      
      // Clear form and close dialog
      form.reset();
      setIsAddUserDialogOpen(false);
      
      // Refresh users list - this will trigger the real-time subscription
      await fetchUsers();
    } catch (error: any) {
      // Handle any other errors
      let errorMessage = "Failed to create user";
      try {
        if (error.message) {
          const parsedError = JSON.parse(error.message);
          errorMessage = parsedError.error || parsedError.message || error.message;
        }
      } catch {
        errorMessage = error.message || errorMessage;
      }
      
      if (errorMessage.includes("email_exists") || errorMessage.includes("already been registered")) {
        toast.error("A user with this email already exists");
      } else {
        toast.error(errorMessage);
      }
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiToggle = (checked: boolean) => {
    setAiEnabled(checked);
    toast.success(`AI responses ${checked ? "enabled" : "disabled"}`);
  };

  const handleCopyChatbotUrl = () => {
    if (!workspace) return;
    const url = `${window.location.origin}/chat/${workspace.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Chatbot URL copied to clipboard");
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !workspace || !isAdmin) return;

    setIsDeletingUser(true);
    try {
      // First remove from accounts_users to revoke access
      const { error: removeAccessError } = await supabase
        .from('accounts_users')
        .delete()
        .eq('user_id', userToDelete.id)
        .eq('account_id', workspace.id);

      if (removeAccessError) throw removeAccessError;

      // Then remove from users table if this was their only workspace
      const { data: otherWorkspaces } = await supabase
        .from('accounts_users')
        .select('account_id')
        .eq('user_id', userToDelete.id);

      if (!otherWorkspaces?.length) {
        const { error: removeUserError } = await supabase
          .from('users')
          .delete()
          .eq('id', userToDelete.id);

        if (removeUserError) throw removeUserError;
      }

      toast.success("User removed successfully");
      setUserToDelete(null);
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to remove user");
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!userToManage || !workspace || !isAdmin) return;

    setIsUpdatingRole(true);
    try {
      const { error } = await supabase
        .from('accounts_users')
        .update({ role: selectedRole })
        .eq('user_id', userToManage.id)
        .eq('account_id', workspace.id);

      if (error) throw error;

      toast.success("User role updated successfully");
      setIsManageDialogOpen(false);
      setUserToManage(null);
      await fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Failed to update user role");
    } finally {
      setIsUpdatingRole(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your system settings and preferences</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Logged in as</p>
          <p className="font-medium">{currentUserEmail}</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chatbot Integration</CardTitle>
            </div>
            <CardDescription>Get your workspace's chatbot URL to embed in your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <code className="flex-1 p-2 bg-muted rounded">
                {workspace ? `${window.location.origin}/chat/${workspace.id}` : 'Loading...'}
              </code>
              <Button onClick={handleCopyChatbotUrl} disabled={!workspace}>
                Copy URL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              AI Configuration
            </CardTitle>
            <CardDescription>Configure AI agent behavior and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable AI Responses</Label>
                <p className="text-sm text-muted-foreground">
                  Allow AI agents to automatically respond to messages
                </p>
              </div>
              <Switch checked={aiEnabled} onCheckedChange={handleAiToggle} />
            </div>
          </CardContent>
        </Card>

        {/* User Management Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>User Management</CardTitle>
              </div>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!isAdmin}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormDescription>The user's email address</FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstName"
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        rules={{ required: "Role is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                              </select>
                            </FormControl>
                            <FormDescription>User's role in the system</FormDescription>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Inviting..." : "Invite User"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>Manage users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          {user.role}
                        </div>
                        {isAdmin && user.email !== currentUserEmail && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUserToManage(user);
                              setSelectedRole(user.role as 'admin' | 'agent');
                              setIsManageDialogOpen(true);
                            }}
                          >
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Management Dialog */}
      <Dialog open={isManageDialogOpen} onOpenChange={(open) => !open && setIsManageDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>User</Label>
              <p className="text-sm">{userToManage?.first_name} {userToManage?.last_name}</p>
              <p className="text-sm text-muted-foreground">{userToManage?.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'agent')}
                className="w-full p-2 border rounded-md"
              >
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setIsManageDialogOpen(false);
                  setUserToManage(null);
                }}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setUserToDelete(userToManage);
                  setIsManageDialogOpen(false);
                }}
                className="flex-1 sm:flex-none"
              >
                Remove User
              </Button>
            </div>
            <Button
              onClick={handleUpdateRole}
              disabled={isUpdatingRole || userToManage?.role === selectedRole}
              className="flex-1 sm:flex-none"
            >
              {isUpdatingRole ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToDelete?.first_name} {userToDelete?.last_name} ({userToDelete?.email}) from this workspace?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingUser}
            >
              {isDeletingUser ? "Removing..." : "Remove User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}