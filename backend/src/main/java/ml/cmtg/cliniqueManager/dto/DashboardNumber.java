package ml.cmtg.cliniqueManager.dto;

public record DashboardNumber(
        long totalPatients,
        long totalConsultations,
        long totalDossiers,
        long totalPersonnels
) {}