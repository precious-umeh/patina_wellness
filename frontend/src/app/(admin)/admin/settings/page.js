"use client";

import AddEditBlockedDateModal from "@/app/components/admin/modals/AddEditBlockedDateModal";
import AddEditTimeSlotModal from "@/app/components/admin/modals/AddEditTimeSlotModal";
import DeleteConfirmationModal from "@/app/components/shared/DeleteConfirmationModal";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";

import GeneralSettings from "@/app/components/admin/settings/GeneralSettings";

import { formatBlockedDate } from "@/app/lib/date";

import ConsultationSettings from "@/app/components/admin/settings/ConsultationSettings";
import BlockedDates from "@/app/components/admin/settings/BlockedDates";

import { useGeneralSettings } from "@/app/hooks/admin/settings/useGeneralSettings";
import { useConsultationAvailability } from "@/app/hooks/admin/settings/useConsultationAvailability";
import { useBlockedDates } from "@/app/hooks/admin/settings/useBlockedDates";

import Reveal from "@/app/components/animations/Reveal";

function AdminSettingsPage() {
  const generalSettings = useGeneralSettings();

  const consultation = useConsultationAvailability();

  const blockedDatesManager = useBlockedDates();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        eyebrow="Administration"
        title="Settings"
        description="Manage general website settings and consultation availability."
      />

      {/* General Settings */}
      <Reveal delay={0.12}>
        <GeneralSettings
          settings={generalSettings.settings}
          loading={generalSettings.loading}
          saving={generalSettings.saving}
          error={generalSettings.error}
          successMessage={generalSettings.successMessage}
          onChange={generalSettings.handleChange}
          onSave={generalSettings.handleSaveSettings}
        />
      </Reveal>

      {/* Consultation Settings */}
      <Reveal delay={0.2}>
        <ConsultationSettings
          availability={consultation.availability}
          loading={consultation.loading}
          saving={consultation.saving}
          error={consultation.error}
          successMessage={consultation.successMessage}
          onToggleAvailability={consultation.handleToggleAvailability}
          onToggleWorkingDay={consultation.handleToggleWorkingDay}
          onAddTimeSlot={consultation.handleOpenAddTimeSlot}
          onEditTimeSlot={consultation.handleOpenEditTimeSlot}
          onRemoveTimeSlot={consultation.handleRemoveTimeSlot}
          onSave={consultation.handleSaveAvailability}
        />
      </Reveal>

      {/* Blocked Dates */}
      <Reveal delay={0.28}>
        <BlockedDates
          blockedDates={blockedDatesManager.blockedDates}
          loading={blockedDatesManager.blockedDatesLoading}
          error={blockedDatesManager.error}
          successMessage={blockedDatesManager.successMessage}
          onAdd={blockedDatesManager.handleOpenAddBlockedDate}
          onEdit={blockedDatesManager.handleOpenEditBlockedDate}
          onDelete={blockedDatesManager.handleOpenDeleteBlockedDate}
        />
      </Reveal>

      <AddEditTimeSlotModal
        key={`time-slot-${consultation.timeSlotModalKey}`}
        isOpen={consultation.isTimeSlotModalOpen}
        onClose={consultation.handleCloseTimeSlotModal}
        slot={consultation.selectedTimeSlot}
        onSave={consultation.handleSaveTimeSlot}
        saving={false}
      />

      <AddEditBlockedDateModal
        key={`blocked-date-${blockedDatesManager.blockedDateModalKey}`}
        isOpen={blockedDatesManager.isBlockedDateModalOpen}
        onClose={blockedDatesManager.handleCloseBlockedDateModal}
        blockedDate={blockedDatesManager.selectedBlockedDate}
        onSave={blockedDatesManager.handleSaveBlockedDate}
        saving={blockedDatesManager.savingBlockedDate}
      />

      <DeleteConfirmationModal
        isOpen={blockedDatesManager.isDeleteBlockedDateModalOpen}
        onClose={blockedDatesManager.handleCloseDeleteBlockedDate}
        onConfirm={blockedDatesManager.handleDeleteBlockedDate}
        loading={blockedDatesManager.deletingBlockedDate}
        title="Remove blocked date?"
        description="This will make the date available for consultation bookings again. This action cannot be undone."
        itemName={
          blockedDatesManager.blockedDateToDelete
            ? formatBlockedDate(blockedDatesManager.blockedDateToDelete.date)
            : ""
        }
      />
    </div>
  );
}

export default AdminSettingsPage;
