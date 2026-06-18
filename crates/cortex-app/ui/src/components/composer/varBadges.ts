import type { ResolvedVariable } from '../../bindings'

export interface BadgeInfo {
  label: string
  cls: string
}

export const GLOBAL_BADGE: BadgeInfo = {
  label: 'Global',
  cls: 'bg-success/15 text-success border-success/30',
}
export const COLLECTION_BADGE: BadgeInfo = {
  label: 'Collection',
  cls: 'bg-accent/15 text-accent border-accent/30',
}
export const FOLDER_BADGE: BadgeInfo = {
  label: 'Folder',
  cls: 'bg-warning/15 text-warning border-warning/30',
}
export const SESSION_BADGE: BadgeInfo = {
  label: 'Session',
  cls: 'bg-bg-muted text-text-secondary border-border-default',
}
export const DYNAMIC_BADGE: BadgeInfo = {
  label: 'Dynamic',
  cls: 'bg-accent/15 text-accent border-accent/30',
}
export const UNRESOLVED_BADGE: BadgeInfo = {
  label: 'Unresolved',
  cls: 'bg-error/15 text-error border-error/30',
}

/**
 * Determine the source badge for a variable.
 *
 * Note: both the active *global* environment (sent to the backend as
 * `environment_name`) and the active *collection* environment
 * (`collection_environment_name`) resolve to the same `environment` scope.
 * We disambiguate by checking whether the variable name belongs to the active
 * collection environment — if so it's Collection, otherwise Global.
 */
export function computeBadge(
  varName: string,
  resolved: ResolvedVariable | null,
  isDynamic: boolean,
  collectionEnvVarNames: Set<string>
): BadgeInfo {
  if (isDynamic) return DYNAMIC_BADGE
  if (!resolved) return UNRESOLVED_BADGE
  switch (resolved.scope) {
    case 'environment':
      return collectionEnvVarNames.has(varName) ? COLLECTION_BADGE : GLOBAL_BADGE
    case 'collection':
      return COLLECTION_BADGE
    case 'folder':
      return FOLDER_BADGE
    case 'global':
      return GLOBAL_BADGE
    case 'runtime':
      return SESSION_BADGE
    case 'dynamic':
      return DYNAMIC_BADGE
    default:
      return GLOBAL_BADGE
  }
}

export function valueToString(v: unknown): string {
  if (v === null || v === undefined) return ''
  return typeof v === 'string' ? v : JSON.stringify(v)
}

export interface PopoverData {
  varName: string
  resolved: ResolvedVariable | null
  isDynamic: boolean
  badge: BadgeInfo
}

export interface PopoverState extends PopoverData {
  visible: boolean
  x: number
  y: number
}
