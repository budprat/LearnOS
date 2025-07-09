import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  type: 'session' | 'group' | 'assessment' | 'deadline';
  time: Date;
  duration?: number;
  description?: string;
}

export default function UpcomingEvents() {
  // Mock data for upcoming events
  const events: Event[] = [
    {
      id: '1',
      title: 'AI Tutoring Session',
      type: 'session',
      time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60
    },
    {
      id: '2',
      title: 'Study Group Meeting',
      type: 'group',
      time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: 90
    },
    {
      id: '3',
      title: 'Math Assessment',
      type: 'assessment',
      time: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 120
    }
  ];

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'session': return <Clock className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'assessment': return <FileText className="h-4 w-4" />;
      case 'deadline': return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'session': return 'text-primary bg-primary/10';
      case 'group': return 'text-accent bg-accent/10';
      case 'assessment': return 'text-warning bg-warning/10';
      case 'deadline': return 'text-destructive bg-destructive/10';
    }
  };

  const formatEventTime = (time: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (time.toDateString() === now.toDateString()) {
      return format(time, 'h:mm a');
    } else if (time.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(time, 'MMM d');
    }
  };

  return (
    <Card className="card-polish animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {event.title}
              </p>
              <p className="text-xs text-gray-500">
                {formatEventTime(event.time)}
                {event.duration && ` • ${event.duration} min`}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {event.type}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}