import {
  ArchiveIcon,
  ChatCircleTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

const STATUS_CONFIG = {
  consultation: {
    pending: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800",
      icon: ClockIcon,
    },

    contacted: {
      label: "Contacted",
      className: "bg-blue-100 text-blue-800",
      icon: PhoneIcon,
    },

    confirmed: {
      label: "Confirmed",
      className: "bg-emerald-100 text-emerald-800",
      icon: CheckCircleIcon,
    },

    completed: {
      label: "Completed",
      className: "bg-purple-100 text-purple-800",
      icon: CheckCircleIcon,
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800",
      icon: XCircleIcon,
    },
  },

  inquiry: {
    new: {
      label: "New",
      className: "bg-amber-100 text-amber-800",
      icon: EnvelopeSimpleIcon,
    },

    read: {
      label: "Read",
      className: "bg-blue-100 text-blue-800",
      icon: EnvelopeSimpleIcon,
    },

    replied: {
      label: "Replied",
      className: "bg-emerald-100 text-emerald-800",
      icon: ChatCircleTextIcon,
    },

    resolved: {
      label: "Resolved",
      className: "bg-purple-100 text-purple-800",
      icon: CheckCircleIcon,
    },
  },

  partnership: {
    new: {
      label: "New",
      className: "bg-amber-100 text-amber-800",
      icon: EnvelopeSimpleIcon,
    },

    contacted: {
      label: "Contacted",
      className: "bg-blue-100 text-blue-800",
      icon: PhoneIcon,
    },

    "in-review": {
      label: "In Review",
      className: "bg-purple-100 text-purple-800",
      icon: MagnifyingGlassIcon,
    },

    approved: {
      label: "Approved",
      className: "bg-emerald-100 text-emerald-800",
      icon: CheckCircleIcon,
    },

    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800",
      icon: XCircleIcon,
    },

    closed: {
      label: "Closed",
      className: "bg-gray-100 text-gray-700",
      icon: ArchiveIcon,
    },
  },
};

function StatusBadge({ status, type = "consultation" }) {
  const normalizedType = type.toLowerCase();
  const normalizedStatus = status?.toLowerCase();

  const typeConfig =
    STATUS_CONFIG[normalizedType] || STATUS_CONFIG.consultation;

  const config =
    typeConfig[normalizedStatus] || typeConfig[Object.keys(typeConfig)[0]];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${config.className}`}
    >
      <Icon size={12} weight="bold" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
