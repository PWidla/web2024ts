import { Observable, BehaviorSubject } from "rxjs";

type ISOString = string;

export type Notification = {
  title: string;
  message: string;
  date: ISOString;
  priority: "low" | "medium" | "high";
  read: boolean;
};

const unreadCountElement = document.getElementById("unread-count");

class NotificationService {
  public notifications: Notification[] = [];
  public notificationsSubject: BehaviorSubject<Notification[]> =
    new BehaviorSubject<Notification[]>(this.notifications);
  public unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  send(notification: Notification): void {
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);

    if (!notification.read) {
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      updateUnreadCount(this.unreadCountSubject.value + 1);
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

  public showDialog(notification: Notification): void {
    alert(`Notification: ${notification.title}\n${notification.message}`);
  }

  markAsRead(index: number): void {
    if (!this.notifications[index].read) {
      this.notifications[index].read = true;
      this.notificationsSubject.next(this.notifications);
      this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
      updateUnreadCount(this.unreadCountSubject.value);
    }
  }
}

function updateUnreadCount(count: number) {
  if (unreadCountElement) {
    unreadCountElement.innerText = `Unread notifications: ${count}`;
  }
}

export default new NotificationService();
