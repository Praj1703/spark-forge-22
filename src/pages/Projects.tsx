import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Plus, Calendar, User, Tag, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profilePicUrl?: string;
  };
  title: string;
  description: string;
  githubLink: string;
  imageUrl?: string;
  tags?: { name: string }[];
  createdAt: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    githubLink: '',
    imageUrl: '',
    tags: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await apiService.getProjects();
      setProjects(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim() || !newProject.githubLink.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        githubLink: newProject.githubLink,
        imageUrl: newProject.imageUrl || undefined,
        tags: newProject.tags ? newProject.tags.split(',').map(tag => tag.trim()) : undefined,
      };

      await apiService.createProject(projectData);
      setNewProject({ title: '', description: '', githubLink: '', imageUrl: '', tags: '' });
      setShowCreateProject(false);
      await fetchProjects();
      
      toast({
        title: "Success",
        description: "Your project has been created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <GlassCard key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Developer Projects</h1>
            <p className="text-muted-foreground mt-1">Showcase your amazing work</p>
          </div>
          <Button
            variant="engineering"
            onClick={() => setShowCreateProject(!showCreateProject)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Create Project Form */}
        {showCreateProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard size="lg">
              <form onSubmit={handleCreateProject} className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Create New Project</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">Project Title *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="My Awesome Project"
                      className="bg-glass border-glass-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-foreground">GitHub Link *</Label>
                    <Input
                      id="github"
                      value={newProject.githubLink}
                      onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                      placeholder="https://github.com/username/project"
                      className="bg-glass border-glass-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description *</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project..."
                    className="bg-glass border-glass-border min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-foreground">Preview Image URL</Label>
                    <Input
                      id="image"
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                      placeholder="https://example.com/preview.jpg"
                      className="bg-glass border-glass-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-foreground">Technologies</Label>
                    <Input
                      id="tags"
                      value={newProject.tags}
                      onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                      placeholder="React, Node.js, MongoDB"
                      className="bg-glass border-glass-border"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" variant="engineering" disabled={creating}>
                    {creating ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateProject(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover="lift" className="h-full flex flex-col">
                {/* Project Image */}
                {project.imageUrl ? (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover border border-glass-border hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="mb-4 h-48 bg-gradient-secondary rounded-lg flex items-center justify-center border border-glass-border">
                    <div className="text-center">
                      <Github className="h-12 w-12 text-secondary-foreground mx-auto mb-2" />
                      <p className="text-sm text-secondary-foreground">No preview available</p>
                    </div>
                  </div>
                )}

                {/* Project Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {typeof tag === 'string' ? tag : tag.name}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Author & Date */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-glass-border">
                    <div className="flex items-center space-x-2">
                      {project.userId.profilePicUrl ? (
                        <img
                          src={project.userId.profilePicUrl}
                          alt={project.userId.username}
                          className="h-6 w-6 rounded-full border border-glass-border"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {project.userId.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{project.userId.username}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-3">
                    <Button
                      variant="glass"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                    {project.imageUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1"
                      >
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <GlassCard className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start showcasing your amazing work by creating your first project!
              </p>
              <Button variant="engineering" onClick={() => setShowCreateProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
};

export default Projects;