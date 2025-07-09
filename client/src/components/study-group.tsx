import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MessageCircle } from "lucide-react";
import { Link } from "wouter";

interface StudyGroupProps {
  studyGroups: any[];
}

export default function StudyGroup({ studyGroups }: StudyGroupProps) {
  const sampleMembers = [
    { id: 1, name: "John", avatar: "J" },
    { id: 2, name: "Maria", avatar: "M" },
    { id: 3, name: "Sam", avatar: "S" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Groups</CardTitle>
      </CardHeader>
      <CardContent>
        {studyGroups && studyGroups.length > 0 ? (
          <div className="space-y-4">
            {studyGroups.map((group: any) => (
              <div key={group.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {sampleMembers.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                          <AvatarFallback className="text-xs bg-primary text-white">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.memberCount} members active
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-primary hover:bg-primary/5"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Discussions
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">
              No study groups yet
            </p>
            <Link href="/community">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                <Plus className="h-4 w-4 mr-2" />
                Join a Study Group
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
