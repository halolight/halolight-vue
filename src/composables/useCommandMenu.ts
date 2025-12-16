import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

export interface CommandMenuContext {
  open: Ref<boolean>
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

export const commandMenuKey: InjectionKey<CommandMenuContext> = Symbol('commandMenu')

/**
 * 创建命令面板上下文（在 AdminLayout 中使用）
 */
export function useProvideCommandMenu() {
  const open = ref(false)

  const context: CommandMenuContext = {
    open,
    openMenu: () => {
      open.value = true
    },
    closeMenu: () => {
      open.value = false
    },
    toggleMenu: () => {
      open.value = !open.value
    },
  }

  provide(commandMenuKey, context)

  return context
}

/**
 * 使用命令面板上下文（在子组件中使用）
 */
export function useCommandMenu() {
  const context = inject(commandMenuKey)

  if (!context) {
    throw new Error('useCommandMenu must be used within a component that provides CommandMenuContext')
  }

  return context
}

/**
 * 安全版本 - 不会抛出错误
 */
export function useCommandMenuOptional() {
  return inject(commandMenuKey, null)
}
