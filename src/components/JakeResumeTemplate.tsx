import { forwardRef } from "react";

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

interface JakeResumeTemplateProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  forPdf?: boolean;
}

const SectionHeader = ({ title }: { title: string }) => (
  <div style={{ 
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    width: '100%',
  }}>
    <span style={{ 
      fontSize: '12px', 
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
      paddingRight: '8px',
    }}>
      {title}
    </span>
    <div style={{ 
      flex: 1,
      height: '1px',
      backgroundColor: '#000000',
    }} />
  </div>
);

export const JakeResumeTemplate = forwardRef<HTMLDivElement, JakeResumeTemplateProps>(
  ({ personalInfo, experiences, education, skills, projects, forPdf = false }, ref) => {
    const filledExperiences = experiences.filter(exp => exp.title || exp.company);
    const filledEducation = education.filter(edu => edu.degree || edu.school);
    const filledProjects = projects.filter(proj => proj.name);
    const skillsList = skills.split(',').map(s => s.trim()).filter(s => s);

    const formatDescription = (description: string) => {
      return description.split('\n').filter(line => line.trim()).map((line, i) => {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        return cleanLine ? (
          <li key={i} style={{ marginBottom: '3px', lineHeight: '1.4', paddingLeft: '4px' }}>
            {cleanLine}
          </li>
        ) : null;
      });
    };

    return (
      <div
        ref={ref}
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: '11px',
          lineHeight: '1.3',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: '48px',
          width: '816px',
          minHeight: '1056px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header - Name */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact Info Line */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '11px',
          marginBottom: '16px',
          color: '#333'
        }}>
          {[
            personalInfo.location,
            personalInfo.phone,
            personalInfo.email,
            personalInfo.linkedin && `linkedin.com/in/${personalInfo.linkedin.replace(/.*linkedin\.com\/in\//, '').replace(/\/$/, '')}`,
            personalInfo.portfolio
          ].filter(Boolean).join(' | ')}
        </div>

        {/* Summary Section */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '16px' }}>
            <SectionHeader title="Summary" />
            <p style={{ margin: 0, textAlign: 'justify', lineHeight: '1.4' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Education Section */}
        {filledEducation.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <SectionHeader title="Education" />
            {filledEducation.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                    {edu.location && <span>, {edu.location}</span>}
                  </div>
                  <span style={{ flexShrink: 0 }}>{edu.graduationDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic' }}>
                  <span>{edu.degree}</span>
                  {edu.gpa && <span style={{ flexShrink: 0 }}>GPA: {edu.gpa}</span>}
                </div>
                {edu.achievements && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '10px' }}>
                    {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {filledExperiences.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <SectionHeader title="Experience" />
            {filledExperiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                    {exp.location && <span>, {exp.location}</span>}
                  </div>
                  <span style={{ flexShrink: 0 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>
                  {exp.title}
                </div>
                {exp.description && (
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '20px',
                    listStyleType: 'disc'
                  }}>
                    {formatDescription(exp.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {filledProjects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <SectionHeader title="Projects" />
            {filledProjects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                    {proj.technologies && (
                      <span style={{ fontStyle: 'italic' }}> | {proj.technologies}</span>
                    )}
                  </div>
                  {proj.link && (
                    <span style={{ fontSize: '10px', color: '#0066cc', flexShrink: 0 }}>
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <ul style={{ 
                    margin: '2px 0 0 0', 
                    paddingLeft: '20px',
                    listStyleType: 'disc'
                  }}>
                    {formatDescription(proj.description)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {skillsList.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <SectionHeader title="Technical Skills" />
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 'bold' }}>Technologies: </span>
              {skillsList.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  }
);

JakeResumeTemplate.displayName = 'JakeResumeTemplate';
