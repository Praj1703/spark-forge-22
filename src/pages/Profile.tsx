import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Github, Globe, Calendar, Users, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    bio: user?.bio || '',
    githubUrl: user?.githubUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    profilePicUrl: user?.profilePicUrl || '',
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const [followersData, followingData, projectsData] = await Promise.all([
        apiService.getFollowers(user._id),
        apiService.getFollowing(user._id),
        apiService.getUserProjects(user._id),
      ]);

      setFollowers(followersData);
      setFollowing(followingData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiService.updateProfile(profileData);
      updateUser(profileData);
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      bio: user?.bio || '',
      githubUrl: user?.githubUrl || '',
      portfolioUrl: user?.portfolioUrl || '',
      profilePicUrl: user?.profilePicUrl || '',
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <GlassCard className="text-center py-12">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <GlassCard hover="lift" size="lg">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              {editing ? (
                <div className="space-y-2">
                  <Label htmlFor="profilePic">Profile Picture URL</Label>
                  <Input
                    id="profilePic"
                    value={profileData.profilePicUrl}
                    onChange={(e) => setProfileData({ ...profileData, profilePicUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-64"
                  />
                </div>
              ) : (
                <>
                  {user.profilePicUrl ? (
                    <img
                      src={user.profilePicUrl}
                      alt={user.username}
                      className="h-24 w-24 rounded-full border-2 border-glass-border shadow-glass"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-glass">
                      <span className="text-2xl font-bold text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
                  <p className="text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {editing ? (
                    <>
                      <Button variant="engineering" onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button variant="ghost" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="glass" onClick={() => setEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {editing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="bg-glass border-glass-border"
                  />
                </div>
              ) : (
                <p className="text-foreground">{user.bio || 'No bio yet'}</p>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4 pt-2">
                {editing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={profileData.githubUrl}
                        onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="bg-glass border-glass-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input
                        id="portfolio"
                        value={profileData.portfolioUrl}
                        onChange={(e) => setProfileData({ ...profileData, portfolioUrl: e.target.value })}
                        placeholder="https://yourportfolio.com"
                        className="bg-glass border-glass-border"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {user.githubUrl && (
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:text-primary/80 transition-smooth"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    )}
                    {user.portfolioUrl && (
                      <a
                        href={user.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:text-primary/80 transition-smooth"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Portfolio
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Join Date */}
              <p className="text-sm text-muted-foreground flex items-center pt-2">
                <Calendar className="h-4 w-4 mr-2" />
                Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard hover="lift" className="text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </GlassCard>
          
          <GlassCard hover="lift" className="text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{followers.length}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
          </GlassCard>
          
          <GlassCard hover="lift" className="text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">{following.length}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <GlassCard>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((project) => (
                <div
                  key={project._id}
                  className="p-4 rounded-lg border border-glass-border bg-glass hover:shadow-glass-hover transition-smooth"
                >
                  <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  {project.tags && (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag: any, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                        >
                          {tag.name || tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Connections */}
        {(followers.length > 0 || following.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {followers.length > 0 && (
              <GlassCard>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Followers ({followers.length})
                </h2>
                <div className="space-y-3">
                  {followers.slice(0, 5).map((follower) => (
                    <div key={follower._id} className="flex items-center space-x-3">
                      {follower.profilePicUrl ? (
                        <img
                          src={follower.profilePicUrl}
                          alt={follower.username}
                          className="h-8 w-8 rounded-full border border-glass-border"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {follower.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground">{follower.username}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {following.length > 0 && (
              <GlassCard>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Following ({following.length})
                </h2>
                <div className="space-y-3">
                  {following.slice(0, 5).map((follow) => (
                    <div key={follow._id} className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {follow.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{follow.username}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;