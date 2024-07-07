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
const allNotificationsCountElement = document.getElementById(
  "all-notifications-count"
);

class NotificationService {
  public notifications: Notification[] = [];
  public notificationsSubject: BehaviorSubject<Notification[]> =
    new BehaviorSubject<Notification[]>(this.notifications);
  public unreadCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  public allNotificationsCountSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  send(notification: Notification): void {
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);

    if (!notification.read) {
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      updateUnreadCount(this.unreadCountSubject.value + 1);
    }

    this.allNotificationsCountSubject.next(this.notifications.length);
    updateAllNotificationsCount(this.notifications.length);

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

  allNotificationsCount(): Observable<number> {
    return this.allNotificationsCountSubject.asObservable();
  }

  showDialog(notification: Notification): void {
    alert(`Notification: ${notification.title}\n${notification.message}`);
  }

  markAsRead(notification: Notification): void {
    const index = this.notifications.findIndex((n) => n === notification);
    if (index !== -1 && !this.notifications[index].read) {
      this.notifications[index].read = true;
      this.notificationsSubject.next(this.notifications);
      this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
      updateUnreadCount(this.unreadCountSubject.value - 1);
    }
  }
}

function updateUnreadCount(count: number) {
  if (unreadCountElement) {
    unreadCountElement.innerText = `Unread notifications: ${count}`;
  }
}

function updateAllNotificationsCount(count: number) {
  if (allNotificationsCountElement) {
    allNotificationsCountElement.innerText = `All notifications: ${count}`;
  }
}

export default new NotificationService();
