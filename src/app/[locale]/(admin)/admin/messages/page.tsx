"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Mail, MailOpen, Eye, Trash2, MessageSquare, Inbox, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: string;
  source?: string;
  createdAt: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({ title: "Error loading messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus } : m));
      
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      console.error("Error updating status:", error);
      fetchMessages(); 
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      setMessages(messages.filter((m) => m._id !== id));
      toast({ title: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({ title: "Error deleting message", variant: "destructive" });
    }
  };

  const handleView = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === "unread") {
      updateMessageStatus(msg._id, "read");
    }
  };

  const subjectLabels: Record<string, string> = {
    general: "General Inquiry",
    quote: "Request a Quote",
    support: "Technical Support",
    partnership: "Partnership",
    other: "Other",
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-black font-bold tracking-tight flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Messages from Contact page & floating widget</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Inbox className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="font-medium text-lg">No messages yet</p>
            <p className="text-sm mt-1">Messages from the Contact page and floating widget will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg._id} className={msg.status === "unread" ? "bg-primary/5 font-medium" : ""}>
                    <TableCell>
                      {msg.status === "unread" ? (
                        <Mail className="w-4 h-4 text-primary" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className={msg.status === "unread" ? "font-semibold" : ""}>{msg.fullName}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{msg.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {subjectLabels[msg.subject] || msg.subject || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {msg.source === "contact-page" ? "Contact Page" : "Widget"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={msg.status === "unread" ? "default" : msg.status === "replied" ? "outline" : "secondary"}
                        className="text-xs capitalize"
                      >
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(msg)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {msg.status !== "replied" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-green-500"
                            onClick={() => updateMessageStatus(msg._id, "replied")}
                            title="Mark as replied"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete message?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMessage(msg._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Message from {selectedMsg?.fullName}
            </DialogTitle>
          </DialogHeader>
          {selectedMsg && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Name</p>
                  <p className="font-medium">{selectedMsg.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Email</p>
                  <p className="font-medium">{selectedMsg.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Phone</p>
                  <p className="font-medium">{selectedMsg.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Company</p>
                  <p className="font-medium">{selectedMsg.company || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Subject</p>
                  <p className="font-medium">{subjectLabels[selectedMsg.subject] || selectedMsg.subject || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Source</p>
                  <Badge variant="secondary" className="text-xs">
                    {selectedMsg.source === "contact-page" ? "Contact Page" : "Floating Widget"}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Message</p>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                {selectedMsg.status !== "replied" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      updateMessageStatus(selectedMsg._id, "replied");
                      setSelectedMsg({ ...selectedMsg, status: "replied" });
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Mark as Replied
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedMsg(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;