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
}

export const JakeResumeTemplate = forwardRef<HTMLDivElement, JakeResumeTemplateProps>(
  ({ personalInfo, experiences, education, skills, projects }, ref) => {
    const filledExperiences = experiences.filter(exp => exp.title || exp.company);
    const filledEducation = education.filter(edu => edu.degree || edu.school);
    const filledProjects = projects.filter(proj => proj.name);
    const skillsList = skills.split(',').map(s => s.trim()).filter(s => s);

    const formatDescription = (description: string) => {
      return description.split('\n').filter(line => line.trim()).map((line, i) => {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        return cleanLine ? (
          <li key={i} style={{ marginBottom: '2px', lineHeight: '1.3' }}>
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
          fontSize: '10pt',
          lineHeight: '1.15',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: '0.5in',
          width: '8.5in',
          minHeight: '11in',
          boxSizing: 'border-box',
        }}
      >
        {/* Header - Name */}
        <div style={{ textAlign: 'center', marginBottom: '4px' }}>
          <h1 style={{ 
            fontSize: '24pt', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact Info Line */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '9pt',
          marginBottom: '12px',
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
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              borderBottom: '1px solid #000', 
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Summary
              </h2>
            </div>
            <p style={{ margin: 0, textAlign: 'justify' }}>
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Education Section */}
        {filledEducation.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              borderBottom: '1px solid #000', 
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Education
              </h2>
            </div>
            {filledEducation.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{edu.school}</span>
                    {edu.location && <span>, {edu.location}</span>}
                  </div>
                  <span>{edu.graduationDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic' }}>
                  <span>{edu.degree}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.achievements && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '9pt' }}>
                    {edu.achievements}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {filledExperiences.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              borderBottom: '1px solid #000', 
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Experience
              </h2>
            </div>
            {filledExperiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                    {exp.location && <span>, {exp.location}</span>}
                  </div>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>
                  {exp.title}
                </div>
                {exp.description && (
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '18px',
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
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              borderBottom: '1px solid #000', 
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Projects
              </h2>
            </div>
            {filledProjects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                    {proj.technologies && (
                      <span style={{ fontStyle: 'italic' }}> | {proj.technologies}</span>
                    )}
                  </div>
                  {proj.link && (
                    <span style={{ fontSize: '9pt', color: '#0066cc' }}>
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <ul style={{ 
                    margin: '2px 0 0 0', 
                    paddingLeft: '18px',
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
          <div style={{ marginBottom: '12px' }}>
            <div style={{ 
              borderBottom: '1px solid #000', 
              paddingBottom: '2px',
              marginBottom: '6px'
            }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: 'bold', 
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Technical Skills
              </h2>
            </div>
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
