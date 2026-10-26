import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import { StudioDesk } from "./studio/StudioDesk";
import { StoryEditor } from "./studio/StoryEditor";

/**
 * Studio Page Facade
 * Coordinates between the StudioDesk overview and the StoryEditor canvas.
 */
export default function Studio() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  const isWriting = location === "/studio/new";

  return (
    <DashboardLayout>
      {user ? (
        isWriting ? (
          <StoryEditor
            editingRecord={editingRecord}
            onClose={() => setEditingRecord(null)}
          />
        ) : (
          <StudioDesk onEditStory={(story) => setEditingRecord(story)} />
        )
      ) : null}
    </DashboardLayout>
  );
}
