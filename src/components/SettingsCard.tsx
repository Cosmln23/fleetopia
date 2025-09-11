import { ReactNode } from 'react';

type SettingsCardProps = {
  fileName: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  title: string;
  description: string;
  titleColor?: string;
  descriptionColor?: string;
  children: ReactNode;
};

export default function SettingsCard({
  fileName,
  Icon,
  iconBgClass,
  title,
  description,
  titleColor = "text-white",
  descriptionColor = "text-white/60",
  children
}: SettingsCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-md hover:bg-black/70 transition overflow-hidden">
      {/* Header cu punctele colorate */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 ring-1 ring-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80 ring-1 ring-yellow-300/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 ring-1 ring-emerald-300/60" />
        </div>
        <div className="text-white/80 text-xs">{fileName}</div>
      </div>

      {/* Content */}
      <div className="p-6 bg-black/30">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ring-1 ${iconBgClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-medium tracking-tight ${titleColor}`}>{title}</h3>
            <p className={`mt-1 text-sm ${descriptionColor}`}>{description}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}