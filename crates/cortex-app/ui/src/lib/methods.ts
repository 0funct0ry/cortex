export function getMethodColor(method: string) {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
    case 'POST':
      return 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
    case 'PUT':
      return 'text-blue-500 bg-blue-500/10 border border-blue-500/20'
    case 'DELETE':
      return 'text-red-500 bg-red-500/10 border border-red-500/20'
    case 'PATCH':
      return 'text-purple-500 bg-purple-500/10 border border-purple-500/20'
    default:
      return 'text-slate-500 bg-slate-500/10 border border-slate-500/20'
  }
}
