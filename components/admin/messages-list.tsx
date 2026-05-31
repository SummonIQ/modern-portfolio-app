"use client";

import { useTransition } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { deleteMessage, markMessageRead } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function MessagesList({ messages }: { messages: Message[] }) {
  const [pending, start] = useTransition();

  function onDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    start(() => {
      void deleteMessage(id);
    });
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((m) => (
        <li
          key={m.id}
          className={cn(
            "rounded-2xl border bg-surface/60 p-5 transition-colors",
            m.read ? "border-border" : "border-brand-400/40 bg-brand-400/5",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{m.name}</span>
                <span className="text-muted-foreground">·</span>
                <a
                  href={`mailto:${m.email}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {m.email}
                </a>
              </div>
              {m.subject && (
                <p className="mt-1 text-sm font-medium text-foreground/90">
                  {m.subject}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80">
                {m.message}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <time className="text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleString()}
              </time>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    start(() => {
                      void markMessageRead(m.id, !m.read);
                    })
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  title={m.read ? "Mark unread" : "Mark read"}
                >
                  {m.read ? (
                    <Mail className="size-4" />
                  ) : (
                    <MailOpen className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onDelete(m.id)}
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
