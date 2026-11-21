import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { CheckCheck, Info, CheckCircle2, AlertTriangle, AlertCircle, Bell } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const { notifications, fetchNotifications, markAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.role);
    }
  }, [user, fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Info className="w-3.5 h-3.5 text-brand-indigo" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-saas-card rounded-lg shadow-saas-hover border border-saas-border z-50 overflow-hidden text-saas-primary animate-fade-in">
      <div className="p-3 bg-saas-surface/80 border-b border-saas-border flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-saas-dim flex items-center space-x-1.5">
          <Bell className="w-3 h-3 text-brand-indigo" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-brand-indigo text-white text-[9px] font-mono">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-saas-border-subtle">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-saas-dim">No recent notifications</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                if (user && !notif.isRead) markAsRead(notif._id, user.role);
              }}
              className={`p-3 text-xs flex items-start space-x-3 cursor-pointer hover:bg-saas-surface/60 transition-colors ${
                !notif.isRead ? 'bg-brand-indigo/5' : 'opacity-70'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-saas-primary">{notif.title}</div>
                <div className="text-saas-muted text-[11px] mt-0.5 leading-relaxed">
                  {notif.message}
                </div>
                <div className="text-[10px] text-saas-dim font-mono mt-1">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
