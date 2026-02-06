# LinkedIn Playbook - Source of Truth Site

## Original Problem Statement
Content reformat for LinkedIn thought leadership "source of truth" site. Update content structure for 9 senior leaders based on research document with pain points, quotes, and ICPs. Keep existing technical structure and styling — reorganize and populate content on each team member's page.

## Architecture
- **Tech Stack**: Vite + React (frontend only, no backend needed)
- **Data**: Static JSON file (`teamData.json`) containing all team member data
- **Routing**: React Router for landing page and individual member dashboards

## User Personas
1. **Senior Leaders** (9 team members) - Use this site as their LinkedIn content reference
2. **Marketing Team** - Use this as reference material for creating posts for leaders

## Core Requirements (Static)
1. Hero section with name, title, niche statement, target role pills
2. Weekly engagement checklist (universal across all members)
3. ICP section with ideal audience details and connect/engage criteria
4. Pain points with collapsible cards showing quotes and post angles
5. Content templates by type (8 templates)
6. "What they're actually saying" section with trending topics
7. Topic calendar with posting frequency and examples
8. Pro tips personalized for each leader
9. NO Opening Messages section (removed per requirements)

## What's Been Implemented (Feb 2026)
- ✅ Complete content structure for all 9 team members
- ✅ Populated data from research document with real quotes
- ✅ Collapsible pain point cards with expandable content
- ✅ Weekly engagement checklist with persistence
- ✅ Content templates with copy-to-clipboard functionality
- ✅ Topic calendar with expandable categories
- ✅ Pro tips section with personalized advice
- ✅ Dark/light theme toggle
- ✅ Mobile responsive design maintained

## Team Members Covered
1. Austin Daniel — Chief Growth Officer
2. Austin Eidson — Design Director  
3. Jerrod Tracy — Director of Engineering
4. Cyril Jones — VP of Scoped Projects
5. Dom Paulk — Senior Product Manager
6. Jesse Kinzer — Marketing Manager
7. Ryan Doss — CTO
8. Scott Blevins — Director of AI
9. Sonya Mead — Senior/Lead Recruiter

## Files Modified
- `/app/src/data/teamData.json` - Complete data for all 9 leaders with pain points, quotes, ICPs, topic calendars, pro tips
- `/app/src/App.jsx` - Restructured dashboard layout with all new sections

## Prioritized Backlog
### P0 (None - MVP Complete)

### P1 (Future Enhancements)
- Add team member profile photos
- Add analytics tracking for template usage
- Export functionality for content templates

### P2 (Nice to Have)
- AI-powered post suggestions based on pain points
- Integration with LinkedIn scheduler
- Collaborative commenting for marketing team

## Next Action Items
- Gather team member photos for profile images
- Get feedback from senior leaders on content accuracy
