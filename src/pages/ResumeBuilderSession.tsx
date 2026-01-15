import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa: string;
  achievements: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export default function ResumeBuilderSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: ""
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }
  ]);
  
  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "", school: "", location: "", graduationDate: "", gpa: "", achievements: "" }
  ]);
  
  const [skills, setSkills] = useState<string>("");
  
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "", description: "", technologies: "", link: "" }
  ]);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
      achievements: ""
    }]);
  };

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: ""
    }]);
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const enhanceWithAI = async (field: 'summary' | 'experience', id?: string) => {
    setIsGenerating(true);
    try {
      let prompt = "";
      if (field === 'summary') {
        prompt = `Improve this professional summary to be more impactful and ATS-friendly. Keep it concise (2-3 sentences). Current summary: "${personalInfo.summary || 'No summary provided'}"
        
        Consider this context:
        - Name: ${personalInfo.fullName || 'Professional'}
        - Recent experience: ${experiences[0]?.title || 'Not specified'} at ${experiences[0]?.company || 'Not specified'}
        
        Return ONLY the improved summary text, nothing else.`;
      } else if (field === 'experience' && id) {
        const exp = experiences.find(e => e.id === id);
        prompt = `Improve these job responsibilities/achievements to be more impactful with quantified results and strong action verbs. Current description: "${exp?.description || 'No description provided'}"
        
        Context: ${exp?.title || 'Position'} at ${exp?.company || 'Company'}
        
        Return ONLY the improved bullet points (use • for bullets), nothing else.`;
      }

      const { data, error } = await supabase.functions.invoke('enhance-resume-content', {
        body: { prompt }
      });

      if (error) throw error;

      const enhancedText = data.content;

      if (field === 'summary') {
        setPersonalInfo({ ...personalInfo, summary: enhancedText });
      } else if (field === 'experience' && id) {
        updateExperience(id, 'description', enhancedText);
      }

      toast({
        title: "Enhanced with AI",
        description: "Content has been improved successfully!",
      });
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast({
        title: "Enhancement failed",
        description: "Could not enhance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResumeText = () => {
    let resume = "";
    
    // Personal Info
    resume += `${personalInfo.fullName}\n`;
    resume += `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n`;
    if (personalInfo.linkedin) resume += `LinkedIn: ${personalInfo.linkedin}\n`;
    if (personalInfo.portfolio) resume += `Portfolio: ${personalInfo.portfolio}\n`;
    resume += "\n";
    
    // Summary
    if (personalInfo.summary) {
      resume += "PROFESSIONAL SUMMARY\n";
      resume += `${personalInfo.summary}\n\n`;
    }
    
    // Experience
    const filledExperiences = experiences.filter(exp => exp.title || exp.company);
    if (filledExperiences.length > 0) {
      resume += "WORK EXPERIENCE\n";
      filledExperiences.forEach(exp => {
        resume += `${exp.title} | ${exp.company}\n`;
        resume += `${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        resume += `${exp.description}\n\n`;
      });
    }
    
    // Education
    const filledEducation = education.filter(edu => edu.degree || edu.school);
    if (filledEducation.length > 0) {
      resume += "EDUCATION\n";
      filledEducation.forEach(edu => {
        resume += `${edu.degree} | ${edu.school}\n`;
        resume += `${edu.location} | ${edu.graduationDate}`;
        if (edu.gpa) resume += ` | GPA: ${edu.gpa}`;
        resume += "\n";
        if (edu.achievements) resume += `${edu.achievements}\n`;
        resume += "\n";
      });
    }
    
    // Skills
    if (skills) {
      resume += "SKILLS\n";
      resume += `${skills}\n\n`;
    }
    
    // Projects
    const filledProjects = projects.filter(proj => proj.name);
    if (filledProjects.length > 0) {
      resume += "PROJECTS\n";
      filledProjects.forEach(proj => {
        resume += `${proj.name}`;
        if (proj.link) resume += ` (${proj.link})`;
        resume += "\n";
        resume += `${proj.description}\n`;
        if (proj.technologies) resume += `Technologies: ${proj.technologies}\n`;
        resume += "\n";
      });
    }
    
    return resume;
  };

  const downloadResume = () => {
    const resumeText = generateResumeText();
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.fullName || 'resume'}_resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Resume Downloaded",
      description: "Your resume has been saved as a text file.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Resume Builder</h1>
              <p className="text-muted-foreground">Create your professional resume with AI assistance</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Edit" : "Preview"}
              </Button>
              <Button 
                className="gradient-primary border-0"
                onClick={downloadResume}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {showPreview ? (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-6 rounded-lg">
                  {generateResumeText() || "Start filling out your information to see the preview."}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your contact details and professional summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn URL</Label>
                        <Input
                          id="linkedin"
                          placeholder="linkedin.com/in/johndoe"
                          value={personalInfo.linkedin}
                          onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input
                          id="portfolio"
                          placeholder="johndoe.com"
                          value={personalInfo.portfolio}
                          onChange={(e) => setPersonalInfo({...personalInfo, portfolio: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="summary">Professional Summary</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => enhanceWithAI('summary')}
                          disabled={isGenerating}
                        >
                          <Sparkles className="mr-1 h-4 w-4" />
                          {isGenerating ? "Enhancing..." : "Enhance with AI"}
                        </Button>
                      </div>
                      <Textarea
                        id="summary"
                        placeholder="A brief 2-3 sentence summary of your professional background and goals..."
                        value={personalInfo.summary}
                        onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Add your relevant work history</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Experience {index + 1}</h4>
                          {experiences.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title *</Label>
                            <Input
                              placeholder="Software Engineer"
                              value={exp.title}
                              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company *</Label>
                            <Input
                              placeholder="Tech Company Inc."
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              placeholder="City, State"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input
                                placeholder="Jan 2022"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input
                                placeholder="Present"
                                value={exp.current ? 'Present' : exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Description / Achievements</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => enhanceWithAI('experience', exp.id)}
                              disabled={isGenerating}
                            >
                              <Sparkles className="mr-1 h-4 w-4" />
                              {isGenerating ? "Enhancing..." : "Enhance with AI"}
                            </Button>
                          </div>
                          <Textarea
                            placeholder="• Led development of key features...&#10;• Improved system performance by 40%...&#10;• Collaborated with cross-functional teams..."
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addExperience} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Experience
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Add your educational background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Education {index + 1}</h4>
                          {education.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree *</Label>
                            <Input
                              placeholder="Bachelor of Science in Computer Science"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>School/University *</Label>
                            <Input
                              placeholder="University of Technology"
                              value={edu.school}
                              onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              placeholder="City, State"
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Date</Label>
                            <Input
                              placeholder="May 2020"
                              value={edu.graduationDate}
                              onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>GPA (Optional)</Label>
                            <Input
                              placeholder="3.8/4.0"
                              value={edu.gpa}
                              onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Achievements / Relevant Coursework</Label>
                          <Textarea
                            placeholder="Dean's List, Relevant coursework in Data Structures, Algorithms..."
                            value={edu.achievements}
                            onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addEducation} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Education
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>List your technical and soft skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma-separated)</Label>
                      <Textarea
                        id="skills"
                        placeholder="JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Agile, Team Leadership, Problem Solving..."
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground">
                        Tip: Include both technical skills and soft skills. Use industry-standard terms for better ATS compatibility.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Showcase your personal or professional projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {projects.map((proj, index) => (
                      <div key={proj.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">Project {index + 1}</h4>
                          {projects.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(proj.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Project Name *</Label>
                            <Input
                              placeholder="E-commerce Platform"
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Link (Optional)</Label>
                            <Input
                              placeholder="github.com/username/project"
                              value={proj.link}
                              onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Built a full-stack e-commerce platform with user authentication, payment processing..."
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Technologies Used</Label>
                          <Input
                            placeholder="React, Node.js, PostgreSQL, Stripe API"
                            value={proj.technologies}
                            onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addProject} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Project
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
