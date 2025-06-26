"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useState } from 'react';
import { TruncatedEmail } from '@/components/ui/truncated-text';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  let user = null;
  let signOut = null;
  let loading = true;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    signOut = authContext.signOut;
    loading = authContext.loading;
  } catch (error) {
    console.warn('Auth context not available:', error);
    // If auth context is not available, assume not loading and no user
    loading = false;
  }

  const handleSignOut = async () => {
    if (!signOut) return;
    
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      // Force reload as fallback
      window.location.href = '/';
    }
  };

  // Render auth button - show login button when loading or no user
  const renderAuthButton = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 z-[60]">
            <div className="px-3 py-2">
              <TruncatedEmail email={user.email} />
              <p className="text-xs text-muted-foreground">
                Signed in via {user.app_metadata?.provider || 'email'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // Show login button when no user (including during loading)
    return (
      <Button 
        size="sm" 
        asChild 
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        disabled={loading}
      >
        <Link href="/auth">
          {loading ? 'Loading...' : 'Sign Up / Log In'}
        </Link>
      </Button>
    );
  };

  // Show loading state briefly to avoid flash
  if (loading) {
    return (
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/neuralstock-logo.png" 
                alt="NeuralStock.ai Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NeuralStock.ai
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/tools" className="text-sm font-medium hover:text-primary transition-colors">
              Tools
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {renderAuthButton()}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[60]">
                <div className="flex flex-col space-y-4 mt-4">
                  <SheetClose asChild>
                    <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors py-2">
                      Tools
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors py-2">
                      Categories
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors py-2">
                      About
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/search" className="text-lg font-medium hover:text-primary transition-colors py-2">
                      Search
                    </Link>
                  </SheetClose>
                  
                  {user ? (
                    <div className="border-t pt-4 space-y-2">
                      <div className="px-2">
                        <TruncatedEmail email={user.email} />
                      </div>
                      <SheetClose asChild>
                        <Link href="/account" className="flex items-center text-lg font-medium hover:text-primary transition-colors py-2">
                          <Settings className="h-5 w-5 mr-2" />
                          Account Settings
                        </Link>
                      </SheetClose>
                      <Button 
                        variant="ghost" 
                        onClick={handleSignOut}
                        className="w-full justify-start text-lg font-medium hover:text-primary transition-colors p-2"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <SheetClose asChild>
                        <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          <Link href="/auth">Sign Up / Log In</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/neuralstock-logo.png" 
              alt="NeuralStock.ai Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                NeuralStock.ai
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/tools" className="text-sm font-medium hover:text-primary transition-colors">
            Tools
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>

          {renderAuthButton()}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] z-[60]">
              <div className="flex flex-col space-y-4 mt-4">
                <SheetClose asChild>
                  <Link href="/tools" className="text-lg font-medium hover:text-primary transition-colors py-2">
                    Tools
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors py-2">
                    Categories
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors py-2">
                    About
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/search" className="text-lg font-medium hover:text-primary transition-colors py-2">
                    Search
                  </Link>
                </SheetClose>
                
                {user ? (
                  <div className="border-t pt-4 space-y-2">
                    <div className="px-2">
                      <TruncatedEmail email={user.email} />
                    </div>
                    <SheetClose asChild>
                      <Link href="/account" className="flex items-center text-lg font-medium hover:text-primary transition-colors py-2">
                        <Settings className="h-5 w-5 mr-2" />
                        Account Settings
                      </Link>
                    </SheetClose>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      className="w-full justify-start text-lg font-medium hover:text-primary transition-colors p-2"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <SheetClose asChild>
                      <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Link href="/auth">Sign Up / Log In</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
