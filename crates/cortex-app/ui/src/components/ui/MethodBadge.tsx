import React from 'react'

interface MethodBadgeProps {
  method: string
  className?: string
}

const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className = '' }) => {
  const methodLower = method.toLowerCase()

  // Mapping of methods to their color tokens
  // We use Tailwind classes like text-method-get and bg-method-get/15 as per spec
  // Note: opacity is 15% in story 03a.04 but 12% in GEMINI.md.
  // I will use 15% as it's the more specific story requirement.

  const getBadgeStyles = (m: string) => {
    switch (m) {
      case 'get':
        return 'text-method-get bg-method-get/15'
      case 'post':
        return 'text-method-post bg-method-post/15'
      case 'put':
        return 'text-method-put bg-method-put/15'
      case 'patch':
        return 'text-method-patch bg-method-patch/15'
      case 'delete':
        return 'text-method-delete bg-method-delete/15'
      case 'head':
        return 'text-method-head bg-method-head/15'
      case 'options':
        return 'text-method-options bg-method-options/15'
      case 'ws':
        return 'text-method-ws bg-method-ws/15'
      case 'sse':
        return 'text-method-sse bg-method-sse/15'
      case 'grpc':
        return 'text-method-grpc bg-method-grpc/15'
      case 'graphql':
        return 'text-method-graphql bg-method-graphql/15'
      case 'trace':
        return 'text-method-trace bg-method-trace/15'
      default:
        return 'text-text-secondary bg-bg-muted/30 border border-border-subtle/30'
    }
  }

  return (
    <div
      className={`w-9 h-[18px] flex items-center justify-center rounded-sm text-[10px] font-bold uppercase select-none ${getBadgeStyles(
        methodLower
      )} ${className}`}
    >
      {method}
    </div>
  )
}

export default MethodBadge
