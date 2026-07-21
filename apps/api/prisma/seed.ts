import { PrismaClient, UserStatus, OppStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.dashboardReport.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.agendaEvent.deleteMany();
  await prisma.activityEvent.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.advisorAssignment.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.program.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.session.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // Permissions
  const permData = [
    { module: 'catalog', action: 'read' }, { module: 'catalog', action: 'write' }, { module: 'catalog', action: 'delete' },
    { module: 'contacts', action: 'read' }, { module: 'contacts', action: 'write' }, { module: 'contacts', action: 'delete' },
    { module: 'opportunities', action: 'read' }, { module: 'opportunities', action: 'write' }, { module: 'opportunities', action: 'delete' },
    { module: 'agenda', action: 'read' }, { module: 'agenda', action: 'write' },
    { module: 'campaigns', action: 'read' }, { module: 'campaigns', action: 'write' },
    { module: 'automations', action: 'read' }, { module: 'automations', action: 'write' },
    { module: 'reporting', action: 'read' },
    { module: 'documents', action: 'read' }, { module: 'documents', action: 'write' },
    { module: 'notifications', action: 'read' },
    { module: 'admin', action: 'manage' },
  ];
  const permissions: any[] = [];
  for (const p of permData) {
    permissions.push(await prisma.permission.create({ data: p }));
  }

  // Roles
  const adminRole = await prisma.role.create({ data: { name: 'Administrador', description: 'Acceso completo al sistema', isSystem: true } });
  const agentRole = await prisma.role.create({ data: { name: 'Agente', description: 'Asesor de admisiones', isSystem: true } });
  const viewerRole = await prisma.role.create({ data: { name: 'Consultor', description: 'Solo lectura', isSystem: true } });

  for (const p of permissions) {
    await prisma.rolePermission.create({ data: { roleId: adminRole.id, permissionId: p.id } });
  }
  const readPerms = permissions.filter(p => p.action === 'read');
  for (const p of readPerms) {
    await prisma.rolePermission.create({ data: { roleId: viewerRole.id, permissionId: p.id } });
  }

  // Users
  const hash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.create({ data: { email: 'admin@crmai.com', passwordHash: hash, firstName: 'Admin', lastName: 'Sistema' } });
  await prisma.userRole.create({ data: { userId: admin.id, roleId: adminRole.id } });

  const agentData = [
    { email: 'agente1@crmai.com', firstName: 'Carlos', lastName: 'Mendoza' },
    { email: 'agente2@crmai.com', firstName: 'Laura', lastName: 'García' },
    { email: 'agente3@crmai.com', firstName: 'Pedro', lastName: 'López' },
  ];
  const agents: any[] = [];
  for (const a of agentData) {
    const u = await prisma.user.create({ data: { ...a, passwordHash: hash } });
    await prisma.userRole.create({ data: { userId: u.id, roleId: agentRole.id } });
    agents.push(u);
  }

  // Pipeline Stages
  const stageDefs = [
    { name: 'Prospecto', position: 0, color: '#94a3b8', isTerminal: false },
    { name: 'Contactado', position: 1, color: '#3b82f6', isTerminal: false },
    { name: 'Calificado', position: 2, color: '#8b5cf6', isTerminal: false },
    { name: 'Propuesta', position: 3, color: '#f59e0b', isTerminal: false },
    { name: 'Negociación', position: 4, color: '#f97316', isTerminal: false },
    { name: 'Ganado', position: 5, color: '#22c55e', isTerminal: true },
    { name: 'Perdido', position: 6, color: '#ef4444', isTerminal: true },
  ];
  const stages: any[] = [];
  for (const s of stageDefs) {
    stages.push(await prisma.pipelineStage.create({ data: s }));
  }

  // Faculties
  const faculties: any[] = [];
  faculties.push(await prisma.faculty.create({ data: { name: 'Facultad de Ingeniería', code: 'FI' } }));
  faculties.push(await prisma.faculty.create({ data: { name: 'Facultad de Ciencias Empresariales', code: 'FCE' } }));
  faculties.push(await prisma.faculty.create({ data: { name: 'Facultad de Ciencias de la Salud', code: 'FCS' } }));

  // Programs
  const progData = [
    { facultyId: faculties[0].id, name: 'Ingeniería en Sistemas', code: 'IS', durationMonths: 48 },
    { facultyId: faculties[0].id, name: 'Ingeniería Industrial', code: 'II', durationMonths: 48 },
    { facultyId: faculties[1].id, name: 'Administración de Empresas', code: 'ADE', durationMonths: 36 },
    { facultyId: faculties[1].id, name: 'Marketing Digital', code: 'MD', durationMonths: 36 },
    { facultyId: faculties[2].id, name: 'Medicina', code: 'MED', durationMonths: 72 },
  ];
  const programs: any[] = [];
  for (const p of progData) {
    programs.push(await prisma.program.create({ data: p }));
  }

  // Cohorts
  const cohortData = [
    { programId: programs[0].id, name: 'IS-2026-A', startDate: new Date('2026-03-01'), endDate: new Date('2030-03-01') },
    { programId: programs[2].id, name: 'ADE-2026-A', startDate: new Date('2026-03-01'), endDate: new Date('2029-03-01') },
    { programId: programs[4].id, name: 'MED-2026-A', startDate: new Date('2026-02-01'), endDate: new Date('2032-02-01') },
  ];
  for (const c of cohortData) {
    await prisma.cohort.create({ data: c });
  }

  // Contacts
  const contactData = [
    { firstName: 'María', lastName: 'Rodríguez', email: 'maria.rodriguez@email.com', phone: '+5491123456789', source: 'web' },
    { firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@email.com', phone: '+5491123456790', source: 'referido' },
    { firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@email.com', phone: '+5491123456791', source: 'instagram' },
    { firstName: 'Luis', lastName: 'González', email: 'luis.gonzalez@email.com', phone: '+5491123456792', source: 'web' },
    { firstName: 'Sofía', lastName: 'López', email: 'sofia.lopez@email.com', phone: '+5491123456793', source: 'facebook' },
    { firstName: 'Diego', lastName: 'Fernández', email: 'diego.fernandez@email.com', phone: '+5491123456794', source: 'web' },
    { firstName: 'Valentina', lastName: 'Torres', email: 'valentina.torres@email.com', phone: '+5491123456795', source: 'referido' },
    { firstName: 'Martín', lastName: 'Díaz', email: 'martin.diaz@email.com', phone: '+5491123456796', source: 'instagram' },
    { firstName: 'Camila', lastName: 'Ruiz', email: 'camila.ruiz@email.com', phone: '+5491123456797', source: 'web' },
    { firstName: 'Andrés', lastName: 'Morales', email: 'andres.morales@email.com', phone: '+5491123456798', source: 'facebook' },
  ];
  const contacts: any[] = [];
  for (const c of contactData) {
    contacts.push(await prisma.contact.create({ data: c }));
  }

  // Opportunities
  const oppConfigs = [
    { contactIdx: 0, progIdx: 0, stageIdx: 3, agentIdx: 0, source: 'web' },
    { contactIdx: 1, progIdx: 2, stageIdx: 1, agentIdx: 1, source: 'referido' },
    { contactIdx: 2, progIdx: 4, stageIdx: 2, agentIdx: 0, source: 'instagram' },
    { contactIdx: 3, progIdx: 1, stageIdx: 5, agentIdx: 2, source: 'web', status: 'WON' as OppStatus },
    { contactIdx: 4, progIdx: 3, stageIdx: 4, agentIdx: 1, source: 'facebook' },
    { contactIdx: 5, progIdx: 0, stageIdx: 0, agentIdx: 2, source: 'web' },
    { contactIdx: 6, progIdx: 4, stageIdx: 6, agentIdx: 0, source: 'referido', status: 'LOST' as OppStatus },
    { contactIdx: 7, progIdx: 2, stageIdx: 2, agentIdx: 1, source: 'instagram' },
    { contactIdx: 8, progIdx: 1, stageIdx: 3, agentIdx: 0, source: 'web' },
    { contactIdx: 9, progIdx: 3, stageIdx: 1, agentIdx: 2, source: 'facebook' },
  ];
  const opportunities: any[] = [];
  for (const o of oppConfigs) {
    opportunities.push(await prisma.opportunity.create({
      data: { contactId: contacts[o.contactIdx].id, programId: programs[o.progIdx].id, currentStageId: stages[o.stageIdx].id, assignedAdvisorId: agents[o.agentIdx].id, source: o.source, status: o.status || 'ACTIVE' },
    }));
  }

  // Enrollment for WON
  await prisma.enrollment.create({
    data: { opportunityId: opportunities[3].id, evidenceUrl: 'https://docs.crmai.com/matricula.pdf', notes: 'Matrícula confirmada', enrolledBy: agents[2].id },
  });

  // Agenda Events
  const now = new Date();
  await prisma.agendaEvent.create({ data: { title: 'Llamada seguimiento - María R.', startDate: new Date(now.getTime() + 86400000), endDate: new Date(now.getTime() + 86400000 + 3600000), eventType: 'call', contactId: contacts[0].id, opportunityId: opportunities[0].id, ownerId: agents[0].id } });
  await prisma.agendaEvent.create({ data: { title: 'Entrevista - Juan P.', startDate: new Date(now.getTime() + 172800000), endDate: new Date(now.getTime() + 172800000 + 7200000), eventType: 'meeting', contactId: contacts[1].id, opportunityId: opportunities[1].id, ownerId: agents[1].id } });
  await prisma.agendaEvent.create({ data: { title: 'Tour guiado por facultad', startDate: new Date(now.getTime() + 259200000), endDate: new Date(now.getTime() + 259200000 + 5400000), eventType: 'visit', contactId: contacts[2].id, opportunityId: opportunities[2].id, ownerId: agents[0].id } });
  await prisma.agendaEvent.create({ data: { title: 'Reunión equipo admisiones', startDate: new Date(now.getTime() + 86400000 * 7), endDate: new Date(now.getTime() + 86400000 * 7 + 3600000), eventType: 'meeting', ownerId: admin.id } });

  // Campaigns
  await prisma.campaign.create({ data: { name: 'Campaña Verano 2026', description: 'Descuentos por inscripción temprana', type: 'email', status: 'active', startDate: new Date('2026-01-01'), endDate: new Date('2026-03-31'), createdBy: admin.id } });
  await prisma.campaign.create({ data: { name: 'Jornada de Puertas Abiertas', description: 'Evento presencial para prospectos', type: 'event', status: 'draft', startDate: new Date('2026-04-15'), endDate: new Date('2026-04-15'), createdBy: admin.id } });
  await prisma.campaign.create({ data: { name: 'Campaña WhatsApp Egresados', description: 'Difusión de programas de posgrado', type: 'whatsapp', status: 'active', startDate: new Date('2026-02-01'), createdBy: admin.id } });

  // Automations
  await prisma.automationRule.create({ data: { name: 'Email bienvenida prospecto', triggerType: 'opportunity_created', actionType: 'send_email', priority: 1, isActive: true } });
  await prisma.automationRule.create({ data: { name: 'Recordatorio seguimiento 7 días', triggerType: 'inactivity_7d', actionType: 'assign_task', priority: 2, isActive: true } });
  await prisma.automationRule.create({ data: { name: 'Notificar oportunidad ganada', triggerType: 'stage_reached', actionType: 'send_notification', triggerConfig: { stageName: 'Ganado' }, priority: 3, isActive: true } });

  // Activities
  await prisma.activityEvent.create({ data: { contactId: contacts[0].id, opportunityId: opportunities[0].id, type: 'note', title: 'Primer contacto telefónico', description: 'Mostró interés en Ing. Sistemas', actorId: agents[0].id } });
  await prisma.activityEvent.create({ data: { contactId: contacts[2].id, opportunityId: opportunities[2].id, type: 'email', title: 'Envío de información', description: 'Se envió brochure de Medicina', actorId: agents[0].id } });
  await prisma.activityEvent.create({ data: { contactId: contacts[4].id, opportunityId: opportunities[4].id, type: 'note', title: 'Solicitó beca', description: 'Preguntó por programas de becas disponibles', actorId: agents[1].id } });

  // Reports
  await prisma.dashboardReport.create({ data: { name: 'Embudo de Ventas', type: 'funnel', config: { stages: stageDefs.map(s => s.name) }, createdBy: admin.id } });
  await prisma.dashboardReport.create({ data: { name: 'Conversión por Programa', type: 'conversion', config: { groupBy: 'program' }, createdBy: admin.id } });
  await prisma.dashboardReport.create({ data: { name: 'Ranking Asesores', type: 'ranking', config: { metric: 'conversion_rate' }, createdBy: admin.id } });

  // Notifications
  await prisma.notification.create({ data: { userId: agents[0].id, type: 'reminder', title: 'Tienes 3 llamadas pendientes', channel: 'in_app' } });
  await prisma.notification.create({ data: { userId: agents[1].id, type: 'alert', title: 'Nuevo prospecto asignado: Juan P.', channel: 'in_app' } });
  await prisma.notification.create({ data: { userId: admin.id, type: 'system', title: 'Reporte semanal disponible', channel: 'in_app' } });

  console.log('Seed completed!');
  console.log('  Admin: admin@crmai.com / Admin123!');
  console.log('  Agents: agente1@crmai.com..3 / Admin123!');
  console.log('  10 contacts, 10 opportunities, 3 campaigns, 3 automations');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
