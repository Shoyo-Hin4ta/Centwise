import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";

import { colors } from "../../theme/colors";

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = getButtonStyles(variant, size);

  return (
    <TouchableOpacity style={[buttonStyle.container, style]} {...props}>
      {typeof children === "string" ? <Text style={buttonStyle.text}>{children}</Text> : children}
    </TouchableOpacity>
  );
}

function getButtonStyles(
  variant: ButtonVariant,
  size: ButtonSize,
): { container: ViewStyle; text: TextStyle } {
  // Base styles
  const baseContainer: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    gap: 8,
  };

  const baseText: TextStyle = {
    fontSize: 14,
    fontWeight: "500",
  };

  // Size variations
  const sizeStyles: Record<ButtonSize, ViewStyle> = {
    default: {
      height: 40,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    sm: {
      height: 36,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    lg: {
      height: 44,
      paddingHorizontal: 32,
      borderRadius: 6,
    },
    icon: {
      height: 40,
      width: 40,
    },
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        backgroundColor: colors.anime.purple,
      },
      text: {
        color: colors.white,
      },
    },
    destructive: {
      container: {
        backgroundColor: "hsl(0, 100%, 50%)",
      },
      text: {
        color: colors.white,
      },
    },
    outline: {
      container: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.gray[300],
      },
      text: {
        color: colors.gray[900],
      },
    },
    secondary: {
      container: {
        backgroundColor: colors.gray[200],
      },
      text: {
        color: colors.gray[900],
      },
    },
    ghost: {
      container: {
        backgroundColor: "transparent",
      },
      text: {
        color: colors.gray[900],
      },
    },
    link: {
      container: {
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        paddingVertical: 0,
        height: undefined,
      },
      text: {
        color: colors.anime.purple,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "transparent",
      },
    },
  };

  return {
    container: {
      ...baseContainer,
      ...sizeStyles[size],
      ...variantStyles[variant].container,
    },
    text: {
      ...baseText,
      ...variantStyles[variant].text,
    },
  };
}
