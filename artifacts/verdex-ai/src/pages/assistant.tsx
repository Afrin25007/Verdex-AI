import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAskAssistant } from "@workspace/api-client-react";

export default function Assistant() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: "Hello. I am the Verdex Farm Assistant. How can I help you optimize your farming today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const askMutation = useAskAssistant();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, askMutation.isPending]);

  const handleSend = () => {
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");

    askMutation.mutate({ data: { question: currentQuery } }, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am unable to connect to the knowledge base right now." }]);
      }
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
          V
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Knowledge Assistant</h1>
          <p className="text-muted-foreground mt-1 text-sm">Expert guidance on schemes, crops, and climate.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-xl border-border bg-card/50 backdrop-blur-sm rounded-3xl">
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] md:max-w-[70%] p-4 text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" 
                  : "bg-white border text-foreground rounded-2xl rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {askMutation.isPending && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white border text-foreground rounded-2xl rounded-tl-sm p-5 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce delay-75" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 bg-white border-t rounded-b-3xl">
          <div className="flex gap-2">
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about fertilizer, weather, or schemes..." 
              className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary h-14 px-6 text-base"
            />
            <Button onClick={handleSend} disabled={askMutation.isPending} className="rounded-full h-14 px-8 shadow-md">
              Send
            </Button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none px-1">
            {["What is the PM-KISAN scheme?", "How to treat leaf blight?", "Irrigation for wheat in Rabi", "Organic fertilizers for tomato"].map(starter => (
              <button 
                key={starter}
                onClick={() => setQuery(starter)}
                className="text-xs bg-muted/50 hover:bg-muted border border-border/50 text-foreground/70 px-4 py-2 rounded-full whitespace-nowrap transition-colors"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
