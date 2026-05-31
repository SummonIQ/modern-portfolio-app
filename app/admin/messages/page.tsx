import { db } from "@/lib/db/client";
import { MessagesList } from "@/components/admin/messages-list";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Inbound contact-form submissions.
        </p>
      </header>
      <MessagesList messages={messages} />
    </div>
  );
}
