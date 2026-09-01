-- Seed data mirroring the design prototype's mock content, so the admin
-- dashboard and public site are populated immediately after `supabase db reset`.

insert into programs (name, category, type, region, participants, status, summary) values
  ('Trujillo Outreach', 'jornada', 'Medical + Feeding', 'South America', 210, 'Active', ''),
  ('Barquisimeto Days', 'jornada', 'Evangelization', 'South America', 340, 'Active', ''),
  ('Copán Relief', 'jornada', 'Resource Drive', 'Central America', 150, 'Planned', ''),
  ('School of Hope', 'flagship', 'Continuous', 'Global', 50, 'Active',
    'Our own online high school, officially registered with the Florida Department of Education in February 2026 and currently working toward Cognia accreditation. Our main focus for growth right now.'),
  ('Miami Elder Visits', 'jornada', 'Elderly Ministry', 'North America', 60, 'Active', ''),
  ('Valencia Youth Camp', 'jornada', 'Youth Outreach', 'Europe', 45, 'Planned', ''),
  ('Earthquake Response ''25', 'relief', 'Disaster Relief', 'South America', 900, 'Completed', ''),
  ('Hope Sports', 'continuous', 'Continuous', 'Multiple', 0, 'Active',
    'Team sports and mentorship that keep kids off the streets and build character.'),
  ('Elderly Ministry', 'continuous', 'Continuous', 'Multiple', 0, 'Active',
    'Companionship, care, and dignity for the elder members of our communities.'),
  ('Disaster Relief', 'relief', 'Relief', 'Multiple', 0, 'Active',
    'Emergency response for earthquakes and crises, from supplies to rebuilding.');

insert into events (name, event_date, location, description, goal_cents, raised_cents, status, cta_label) values
  ('Lights of Hope Gala', '2026-12-12', 'Orlando, FL',
    'An evening of dinner and stories to fund next year''s jornadas in Venezuela and the United States.',
    6000000, 3600000, 'Active', 'Reserve a seat'),
  ('Run for the Nations 5K', '2026-11-08', 'Miami, FL',
    'Community 5K supporting School of Hope scholarships.',
    1500000, 420000, 'Active', 'Register'),
  ('Holiday Giving Drive', '2026-12-13', 'Nationwide',
    'Toy and supply drive for children across all regions.',
    2000000, 0, 'Planned', 'Donate items');

insert into donations (donor_name, donor_email, amount_cents, kind, created_at) values
  ('James Wu', 'james.wu@example.com', 50000, 'one_time', '2026-08-09'),
  ('Sarah Coleman', 'sarah.coleman@example.com', 7500, 'monthly', '2026-08-09'),
  ('Grace Fellowship Church', 'giving@gracefellowship.example.org', 240000, 'one_time', '2026-08-07'),
  ('Miguel Torres', 'miguel.torres@example.com', 5000, 'monthly', '2026-08-06'),
  ('The Reynolds Foundation', 'grants@reynoldsfoundation.example.org', 1000000, 'one_time', '2026-08-02'),
  ('Anna Kim', 'anna.kim@example.com', 3000, 'one_time', '2026-07-30');

insert into posts (title, type, author, tag, body, status, published_at) values
  ('Daniela Castillo', 'story', 'Maria Alvarez', 'STORY',
    'A single mother learning to bake her way toward independence.', 'published', '2026-06-01'),
  ('Hector Romero', 'story', 'Maria Alvarez', 'STORY',
    'Cutting hair and rebuilding confidence, one client at a time.', 'published', '2026-05-01'),
  ('Ana Jimenez', 'story', 'Maria Alvarez', 'STORY',
    'New glasses restored four years of clear sight.', 'published', '2026-04-01'),
  ('Dylan Perez', 'story', 'Maria Alvarez', 'STORY',
    'Found a home and a fresh start at Casa de Esperanza.', 'published', '2026-03-01'),
  ('How our online high school reached its 1,000th graduate', 'blog', 'Carlos Fernandez', 'SCHOOL OF HOPE',
    '', 'published', '2026-07-01'),
  ('Inside a jornada: 48 hours in Copán, Honduras', 'blog', 'Luis Torres', 'JORNADAS',
    '', 'published', '2026-06-01'),
  ('One year after the earthquake: what recovery looks like', 'blog', 'Carlos Fernandez', 'RELIEF',
    '', 'draft', null),
  ('Why we chose to grow beyond Venezuela', 'blog', 'Carlos Fernandez', 'PARTNERSHIPS',
    '', 'published', '2026-03-01'),
  ('New School of Hope scholarship program', 'blog', 'Rebecca Kim', 'SCHOOL OF HOPE',
    '', 'draft', null);

insert into gallery_photos (location, region, caption) values
  ('Barquisimeto, Venezuela', 'South America', 'March 2026'),
  ('Trujillo, Venezuela', 'South America', 'January 2026'),
  ('Miami, USA', 'North America', 'September 2025');
-- Central America and Europe jornadas haven't happened yet — add rows here
-- once real photos exist and the gallery's region filter will pick them up
-- automatically (see app/[locale]/(public)/gallery/page.tsx).

insert into leaders (name, role, bio, sort_order) values
  ('Luzbell Wood', 'Founder & Executive Director',
    'Luzbell Wood is the founder of both Hope for the Nations and School of Hope International. Originally from Venezuela and a U.S. resident for more than 20 years, she has dedicated her life to serving vulnerable communities through education, humanitarian initiatives, and community development. Her vision is rooted in faith, compassion, and the belief that education creates opportunities capable of transforming generations.',
    1),
  ('Carla Montaño', 'Director of Technology & School of Hope International',
    'Carla Montaño is an educator by profession and a software engineer by vocation. Originally from Venezuela, she lived in the United States for over 10 years, where she worked in education before transitioning into technology. Today, she leads the technology strategy for Hope for the Nations while directing the development and operations of School of Hope International. Her passion is leveraging technology to expand educational access and create meaningful opportunities for students around the world.',
    2);
