import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;

export function DropdownMenuContent({ className, sideOffset = 6, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        collisionPadding={12}
        className={cn('z-[700] min-w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-gray-900 shadow-xl outline-none', className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuLabel({ className, ...props }) {
  return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn('px-3 py-2 text-sm font-semibold', className)} {...props} />;
}

export function DropdownMenuItem({ className, inset = false, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      className={cn('relative flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0', className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('-mx-1 my-1 h-px bg-gray-100', className)} {...props} />;
}
