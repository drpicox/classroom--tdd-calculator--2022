export class Calculator {
  #display = 0;
  #dirty = false;
  #stack = [];

  getDisplay() {
    return this.#display;
  }

  enterNumber(number) {
    if (this.#dirty) {
      this.#display = 0;
      this.#dirty = false;
    }
    this.#display = this.#display * 10 + number;
  }

  next() {
    this.#push(this.#display);
    this.#dirty = true;
  }

  clear() {
    if (this.#display === 0) this.#stack = [];
    else this.#display = 0;
  }

  addition() {
    this.#display += this.#pop();
    this.#dirty = true;
  }

  substraction() {
    this.#display = this.#pop() - this.#display;
    this.#dirty = true;
  }

  multiplication() {
    this.#display *= this.#pop();
    this.#dirty = true;
  }

  division() {
    const previous = this.#pop();
    if (this.#display === 0) this.#display = 0;
    else this.#display = Math.floor(previous / this.#display);
    this.#dirty = true;
  }

  #pop = () => {
    if (this.#stack.length === 0) return 0;
    return this.#stack.pop();
  };

  #push = (n) => {
    return this.#stack.push(n);
  };
}
