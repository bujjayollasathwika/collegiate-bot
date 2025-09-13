import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, BookOpen, MapPin, Clock, Users, Phone, Coffee } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

interface CampusData {
  schedules: any[];
  facilities: any[];
  dining: any[];
  library: any[];
  admin: any[];
}

const campusData: CampusData = {
  schedules: [
    { name: "Computer Science 101", time: "9:00 AM - 10:30 AM", location: "Room 204", days: "Mon, Wed, Fri" },
    { name: "Mathematics 201", time: "2:00 PM - 3:30 PM", location: "Room 301", days: "Tue, Thu" },
    { name: "Physics Lab", time: "10:00 AM - 12:00 PM", location: "Lab Building", days: "Wednesday" }
  ],
  facilities: [
    { name: "Main Library", hours: "7:00 AM - 11:00 PM", location: "Central Campus", services: ["Study rooms", "Computer lab", "Printing"] },
    { name: "Recreation Center", hours: "5:00 AM - 11:00 PM", location: "North Campus", services: ["Gym", "Pool", "Basketball courts"] },
    { name: "Student Union", hours: "6:00 AM - 12:00 AM", location: "Main Campus", services: ["Food court", "Bookstore", "Meeting rooms"] }
  ],
  dining: [
    { name: "Main Cafeteria", hours: "7:00 AM - 9:00 PM", location: "Student Union", type: "All-you-can-eat" },
    { name: "Coffee Corner", hours: "6:00 AM - 8:00 PM", location: "Library", type: "Coffee & Snacks" },
    { name: "Pizza Plaza", hours: "11:00 AM - 11:00 PM", location: "North Campus", type: "Fast food" }
  ],
  library: [
    { service: "Book checkout", hours: "7:00 AM - 10:00 PM", location: "Main desk" },
    { service: "Study rooms", hours: "24/7", location: "2nd & 3rd floors", booking: "Online reservation required" },
    { service: "Computer lab", hours: "7:00 AM - 11:00 PM", location: "1st floor", access: "Student ID required" }
  ],
  admin: [
    { office: "Registrar", hours: "8:00 AM - 5:00 PM", location: "Admin Building 101", services: ["Transcripts", "Enrollment", "Records"] },
    { office: "Financial Aid", hours: "8:00 AM - 5:00 PM", location: "Admin Building 205", services: ["Scholarships", "Loans", "Work-study"] },
    { office: "Student Services", hours: "8:00 AM - 6:00 PM", location: "Student Union 150", services: ["Counseling", "Career services", "Health center"] }
  ]
};

const generateResponse = (query: string): { content: string; category: string } => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('schedule') || lowerQuery.includes('class') || lowerQuery.includes('course')) {
    const schedule = campusData.schedules[0];
    return {
      content: `Here's some schedule information: ${schedule.name} meets ${schedule.days} from ${schedule.time} in ${schedule.location}. Would you like information about other classes?`,
      category: 'schedules'
    };
  }
  
  if (lowerQuery.includes('library')) {
    return {
      content: `The Main Library is open 7:00 AM - 11:00 PM and offers study rooms (available 24/7 with online reservation), computer lab access with student ID, and book checkout services. How can I help you with library services?`,
      category: 'library'
    };
  }
  
  if (lowerQuery.includes('dining') || lowerQuery.includes('food') || lowerQuery.includes('cafe')) {
    return {
      content: `Our dining options include: Main Cafeteria (7 AM-9 PM, all-you-can-eat), Coffee Corner in the library (6 AM-8 PM), and Pizza Plaza on North Campus (11 AM-11 PM). What type of food are you looking for?`,
      category: 'dining'
    };
  }
  
  if (lowerQuery.includes('facility') || lowerQuery.includes('gym') || lowerQuery.includes('recreation')) {
    return {
      content: `The Recreation Center on North Campus is open 5:00 AM - 11:00 PM and includes a gym, pool, and basketball courts. The Student Union (6 AM-12 AM) has the food court, bookstore, and meeting rooms. Need directions to any facilities?`,
      category: 'facilities'
    };
  }
  
  if (lowerQuery.includes('admin') || lowerQuery.includes('office') || lowerQuery.includes('registrar') || lowerQuery.includes('financial aid')) {
    return {
      content: `Administrative offices are in the Admin Building: Registrar (Room 101) for transcripts and enrollment, Financial Aid (Room 205) for scholarships and loans, and Student Services (Student Union 150) for counseling and career services. All open 8 AM-5 PM. Which office do you need?`,
      category: 'admin'
    };
  }
  
  return {
    content: `I can help you with campus information including class schedules, facilities, dining options, library services, and administrative procedures. What would you like to know about?`,
    category: 'general'
  };
};

export const CampusAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Smart Campus Assistant. I can help you with schedules, facilities, dining, library services, and administrative procedures. What would you like to know?",
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        category: response.category
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Clock, label: "Class Schedules", query: "show me class schedules" },
    { icon: BookOpen, label: "Library Hours", query: "library hours and services" },
    { icon: Coffee, label: "Dining Options", query: "campus dining options" },
    { icon: MapPin, label: "Facilities", query: "campus facilities" },
    { icon: Users, label: "Admin Offices", query: "administrative offices" },
    { icon: Phone, label: "Contact Info", query: "contact information" }
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-hero text-white p-6 shadow-campus-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Smart Campus Assistant</h1>
          <p className="text-white/90">Your AI-powered guide to campus information and services</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 overflow-hidden">
        <div className="h-full flex flex-col bg-surface-elevated rounded-xl shadow-campus-md">
          
          {/* Quick Actions */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-campus-primary/20 hover:bg-campus-primary hover:text-white transition-smooth"
                  onClick={() => {
                    setInput(action.query);
                    handleSend();
                  }}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[80%]">
                    <div
                      className={`p-3 rounded-lg transition-smooth ${
                        message.type === 'user'
                          ? 'bg-chat-user text-chat-user-foreground ml-4'
                          : 'bg-chat-assistant text-chat-assistant-foreground mr-4 border border-border'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.category && message.type === 'assistant' && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {message.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-chat-assistant text-chat-assistant-foreground p-3 rounded-lg mr-4 border border-border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-campus-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about schedules, facilities, dining, library, or admin..."
                className="flex-1 bg-chat-input border-input-border focus:ring-2 focus:ring-campus-primary focus:border-transparent transition-smooth"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-campus-primary hover:bg-primary-hover text-white shadow-campus-sm transition-smooth"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};