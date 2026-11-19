-- Fills in the Spanish version of the content that already exists, so the site
-- is bilingual from day one. Run AFTER 0014_bilingual_content.sql.
--
-- Idempotent: every statement only touches rows whose "_es" value is still
-- empty, so re-running it (or running it after an editor has already
-- translated something by hand) never overwrites anyone's work.
-- These are first-pass translations; edit any of them from the admin editors.

-- ── Posts ────────────────────────────────────────────────────────────────
update posts set title_es = 'Daniela Castillo', category_es = 'HISTORIA',
  body_es = 'Una madre soltera que aprende a hornear para lograr su independencia.'
  where slug = 'daniela-castillo' and title_es is null;
update posts set title_es = 'Hector Romero', category_es = 'HISTORIA',
  body_es = 'Cortando cabello y reconstruyendo la confianza, un cliente a la vez.'
  where slug = 'hector-romero' and title_es is null;
update posts set title_es = 'Dylan Perez', category_es = 'HISTORIA',
  body_es = 'Encontró un hogar y un nuevo comienzo en Casa de Esperanza.'
  where slug = 'dylan-perez' and title_es is null;
update posts set title_es = 'Ana Jimenez', category_es = 'HISTORIA',
  body_es = 'Unos lentes nuevos le devolvieron cuatro años de visión clara.'
  where slug = 'ana-jimenez' and title_es is null;
update posts set title_es = 'Cómo nuestra escuela secundaria en línea llegó a su graduado número 1,000',
  category_es = 'SCHOOL OF HOPE'
  where slug = 'how-our-online-high-school-reached-its-1-000th-graduate' and title_es is null;
update posts set title_es = 'Dentro de una jornada: 48 horas en Copán, Honduras', category_es = 'JORNADAS'
  where slug = 'inside-a-jornada-48-hours-in-cop-n-honduras' and title_es is null;
update posts set title_es = 'Un año después del terremoto: cómo se ve la recuperación', category_es = 'AYUDA'
  where slug = 'one-year-after-the-earthquake-what-recovery-looks-like' and title_es is null;
update posts set title_es = 'Por qué decidimos crecer más allá de Venezuela', category_es = 'ALIANZAS'
  where slug = 'why-we-chose-to-grow-beyond-venezuela' and title_es is null;
update posts set title_es = 'Nuevo programa de becas de School of Hope', category_es = 'SCHOOL OF HOPE'
  where slug = 'new-school-of-hope-scholarship-program' and title_es is null;

-- ── Programs ─────────────────────────────────────────────────────────────
update programs set name_es = 'Hope Sports',
  summary_es = 'Deportes en equipo y mentoría que mantienen a los niños lejos de las calles y forjan carácter.'
  where name = 'Hope Sports' and name_es is null;
update programs set name_es = 'Ministerio de Adultos Mayores',
  summary_es = 'Compañía, cuidado y dignidad para los adultos mayores de nuestras comunidades.'
  where name = 'Elderly Ministry' and name_es is null;
update programs set name_es = 'Ayuda en Desastres',
  summary_es = 'Respuesta de emergencia ante terremotos y crisis, desde suministros hasta la reconstrucción.'
  where name = 'Disaster Relief' and name_es is null;
update programs set name_es = 'School of Hope',
  summary_es = 'Nuestra propia escuela secundaria en línea, registrada oficialmente ante el Departamento de Educación de Florida en febrero de 2026 y actualmente en proceso de acreditación con Cognia. Nuestro principal enfoque de crecimiento en este momento.'
  where name = 'School of Hope' and name_es is null;
update programs set name_es = 'Respuesta al terremoto ''25' where name = 'Earthquake Response ''25' and name_es is null;
update programs set name_es = 'Campamento Juvenil de Valencia' where name = 'Valencia Youth Camp' and name_es is null;
update programs set name_es = 'Ayuda en Copán' where name = 'Copán Relief' and name_es is null;
update programs set name_es = 'Jornadas en Barquisimeto' where name = 'Barquisimeto Days' and name_es is null;
update programs set name_es = 'Jornada en Ciudad Bolívar' where name = 'Ciudad Bolivar Outreach' and name_es is null;
update programs set name_es = 'Visitas a Adultos Mayores en Miami' where name = 'Miami Elder Visits' and name_es is null;

-- ── Events ───────────────────────────────────────────────────────────────
update events set name_es = 'Carrera Run for the Nations 5K',
  description_es = 'Carrera comunitaria de 5K a beneficio de las becas de School of Hope.',
  cta_label_es = 'Registrarse'
  where name = 'Run for the Nations 5K' and name_es is null;
update events set name_es = 'Colecta Navideña de Donaciones',
  description_es = 'Colecta de juguetes y suministros para niños de todas las regiones.',
  cta_label_es = 'Donar artículos'
  where name = 'Holiday Giving Drive' and name_es is null;
update events set name_es = 'Gala Luces de Esperanza',
  description_es = 'Una noche de cena e historias para financiar las jornadas del próximo año en Venezuela y Estados Unidos.',
  cta_label_es = 'Reservar lugar'
  where name = 'Lights of Hope Gala' and name_es is null;

-- ── Leaders ──────────────────────────────────────────────────────────────
update leaders set role_es = 'Fundadora y Directora Ejecutiva',
  bio_es = 'Luzbell Wood es la fundadora de Hope for the Nations y de School of Hope International. Originaria de Venezuela y residente en Estados Unidos desde hace más de 20 años, ha dedicado su vida a servir a comunidades vulnerables a través de la educación, las iniciativas humanitarias y el desarrollo comunitario. Su visión se fundamenta en la fe, la compasión y la convicción de que la educación crea oportunidades capaces de transformar generaciones.'
  where name = 'Luzbell Wood' and role_es is null;
update leaders set role_es = 'Directora de Tecnología',
  bio_es = 'Carla Montaño es educadora de profesión e ingeniera de software por vocación. Originaria de Venezuela, vivió en Estados Unidos por más de 10 años, donde trabajó en el ámbito educativo antes de pasar a la tecnología. Hoy lidera la estrategia tecnológica de Hope for the Nations y dirige el desarrollo y las operaciones de School of Hope International. Su pasión es aprovechar la tecnología para ampliar el acceso a la educación y crear oportunidades significativas para estudiantes de todo el mundo.'
  where name = 'Carla Montaño' and role_es is null;

-- ── Gallery captions ─────────────────────────────────────────────────────
update gallery_photos set caption_es = 'Una jornada de atención, manualidades y bolsas con útiles escolares en el campo guariqueño'
  where caption = 'A day of care, crafts and school-supply bags in the Guárico countryside' and caption_es is null;
update gallery_photos set caption_es = 'Ayuda tras el terremoto'
  where caption = 'After Earthquake relief' and caption_es is null;
update gallery_photos set caption_es = 'Estaciones médicas, bolsas de útiles escolares y voluntarios a lo largo de la ribera del río'
  where caption = 'Medical stations, school-supply bags and volunteers along the riverfront' and caption_es is null;
update gallery_photos set caption_es = 'Comidas calientes, cortes de cabello, atención médica y ropa donada'
  where caption = 'Hot meals, haircuts, medical care and donated clothing' and caption_es is null;

-- ── Impact milestones ────────────────────────────────────────────────────
-- These were written in Spanish, so the current text moves to the "_es" column
-- and the English version takes the base column. All right-hand sides read the
-- ORIGINAL row, so the swap is done in one statement.
update impact_milestones set
  area_es = area,
  impact_value_es = impact_value,
  area = case area
    when 'Alimentación' then 'Food'
    when 'Emprendimiento' then 'Entrepreneurship'
    when 'Higiene' then 'Hygiene'
    when 'Salud y medicamentos' then 'Health & medicine'
    else area end,
  impact_value = case impact_value
    when '≈ 2,400 comidas' then '≈ 2,400 meals'
    when '3,000 platos de sopa' then '3,000 bowls of soup'
    when '200 personas' then '200 people'
    when '200 negocios/emprendedores' then '200 businesses/entrepreneurs'
    when '≈ 2,000 kits' then '≈ 2,000 kits'
    when '≈ 1,000 pacientes atendidos' then '≈ 1,000 patients served'
    when 'Meta: 100 estudiantes becados' then 'Goal: 100 scholarship students'
    else impact_value end
where area_es is null;
