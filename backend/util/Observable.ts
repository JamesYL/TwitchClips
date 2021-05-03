export type OnUpdate = (progress: number, completed: boolean) => unknown;
class Observable {
  private progress: number;
  private onUpdate: OnUpdate | null;

  constructor(onUpdate: OnUpdate | null) {
    this.progress = 0;
    this.onUpdate = onUpdate;
  }
  updateProgress(changeProgress: number): void {
    this.progress += Math.abs(changeProgress);
    if (this.onUpdate) this.onUpdate(this.progress, false);
  }
  finish(): void {
    if (this.onUpdate) this.onUpdate(this.progress, true);
  }
}
export default Observable;
