import { Observable, BehaviorSubject } from "rxjs";

type ISOString = string;

export type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: "low" | "medium" | "high";
  read: boolean;
};

class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject: BehaviorSubject<Notification[]> =
    new BehaviorSubject<Notification[]>(this.notifications);
  private unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  send(notification: Notification): void {
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);
    if (!notification.read) {
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    }
    if (
      notification.priority === "medium" ||
      notification.priority === "high"
    ) {
      this.showDialog(notification);
    }
  }

  list(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  unreadCount(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  private showDialog(notification: Notification): void {
    alert(`Notification: ${notification.title}\n${notification.message}`);
  }

  markAsRead(index: number): void {
    if (!this.notifications[index].read) {
      this.notifications[index].read = true;
      this.notificationsSubject.next(this.notifications);
      this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
    }
  }
}

export default new NotificationService();
