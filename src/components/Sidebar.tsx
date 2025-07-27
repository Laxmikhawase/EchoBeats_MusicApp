import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  const libraryItems = [
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'playlists', label: 'Your Playlists', icon: Music },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <Music className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">EchoBeats</span>
        </div>

        <nav className="space-y-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sidebar-foreground"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground">LIBRARY</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <nav className="space-y-1">
          {libraryItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start text-sidebar-foreground text-sm"
              onClick={() => onViewChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="mt-8 p-4 bg-gradient-card rounded-lg border border-border/40">
          <h4 className="font-semibold mb-2">Create your first playlist</h4>
          <p className="text-sm text-muted-foreground mb-4">
            It's easy, we'll help you
          </p>
          <Button variant="spotify" size="sm" className="w-full">
            Create playlist
          </Button>
        </div>
      </div>
    </div>
  );
}