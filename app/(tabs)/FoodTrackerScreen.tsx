import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { addMeal } from "./two";
import { useTodaysMeals } from "./todaysfood";
import { deleteMeal } from "./remove";
import { updateMeal } from "./edit";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function FoodTrackerScreen() {
  const meals = useTodaysMeals();

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("lunch");
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFoodName, setEditFoodName] = useState("");
  const [editCalories, setEditCalories] = useState("");
  const [editMealType, setEditMealType] = useState("lunch");
  const [editError, setEditError] = useState("");

  const totalCalories = useMemo(() => {
    return meals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
  }, [meals]);

  const onSave = async () => {
    setError("");

    if (!foodName.trim()) return setError("Enter a food name");
    if (!calories || isNaN(Number(calories))) return setError("Enter valid calories");

    try {
      await addMeal({ foodName, calories, mealType });
      setFoodName("");
      setCalories("");
    } catch (e) {
      setError(e.message || "Failed to save meal");
    }
  };

  const openEdit = (item) => {
    setEditError("");
    setEditId(item.id);
    setEditFoodName(item.foodName ?? "");
    setEditCalories(String(item.calories ?? ""));
    setEditMealType(item.mealType ?? "lunch");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const onEditSave = async () => {
    setEditError("");

    if (!editFoodName.trim()) return setEditError("Enter a food name");
    if (!editCalories || isNaN(Number(editCalories))) return setEditError("Enter valid calories");
    if (!editId) return setEditError("Missing meal id");

    try {
      await updateMeal(editId, {
        foodName: editFoodName,
        calories: editCalories,
        mealType: editMealType,
      });
      closeEdit();
    } catch (e) {
      setEditError(e.message || "Failed to update meal");
    }
  };

  const Chip = ({ label, selected, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );

  const Button = ({ title, variant = "primary", onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        variant === "primary" && styles.btnPrimary,
        variant === "ghost" && styles.btnGhost,
        variant === "danger" && styles.btnDanger,
        pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          variant === "primary" && styles.btnTextPrimary,
          variant === "ghost" && styles.btnTextGhost,
          variant === "danger" && styles.btnTextPrimary,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Food Tracker</Text>
            <Text style={styles.subtitle}>Log meals and track today’s calories.</Text>
          </View>

          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add meal</Text>

            <Text style={styles.label}>Food name</Text>
            <TextInput
              placeholder="e.g., Chicken wrap"
              placeholderTextColor="#8B90A0"
              value={foodName}
              onChangeText={setFoodName}
              style={styles.input}
            />

            <Text style={styles.label}>Calories</Text>
            <TextInput
              placeholder="e.g., 450"
              placeholderTextColor="#8B90A0"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Meal type</Text>
            <View style={styles.chipRow}>
              {MEAL_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={mealType === t}
                  onPress={() => setMealType(t)}
                />
              ))}
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Button title="Save meal" onPress={onSave} />
          </View>

          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today</Text>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total calories</Text>
                <Text style={styles.totalValue}>{totalCalories} kcal</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{meals.length} meals</Text>
              </View>
            </View>
          </View>

          
          <View style={[styles.card, { flex: 1, paddingBottom: 12 }]}>
            <Text style={styles.cardTitle}>Logged meals</Text>

            <FlatList
              data={meals}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 4 }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>No meals yet</Text>
                  <Text style={styles.emptyText}>Add your first meal above.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.mealRow}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={styles.mealName} numberOfLines={1}>
                      {item.foodName}
                    </Text>
                    <Text style={styles.mealMeta}>
                      {item.mealType} • {item.calories} cal
                    </Text>
                  </View>

                  <View style={styles.rowButtons}>
                    <Button title="Edit" variant="ghost" onPress={() => openEdit(item)} />
                    <Button title="Delete" variant="danger" onPress={() => deleteMeal(item.id)} />
                  </View>
                </View>
              )}
            />
          </View>

         
          <Modal visible={editOpen} transparent animationType="fade" onRequestClose={closeEdit}>
            <Pressable style={styles.backdrop} onPress={closeEdit} />

            <View style={styles.sheetWrap}>
              <View style={styles.sheet}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 12 }}>
                  <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Edit meal</Text>
                    <Pressable onPress={closeEdit} style={styles.closeBtn}>
                      <Text style={styles.closeText}>✕</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.label}>Food name</Text>
                  <TextInput
                    placeholder="Food name"
                    placeholderTextColor="#8B90A0"
                    value={editFoodName}
                    onChangeText={setEditFoodName}
                    style={styles.input}
                  />

                  <Text style={styles.label}>Calories</Text>
                  <TextInput
                    placeholder="Calories"
                    placeholderTextColor="#8B90A0"
                    value={editCalories}
                    onChangeText={setEditCalories}
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <Text style={styles.label}>Meal type</Text>
                  <View style={styles.chipRow}>
                    {MEAL_TYPES.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        selected={editMealType === t}
                        onPress={() => setEditMealType(t)}
                      />
                    ))}
                  </View>

                  {!!editError && <Text style={styles.error}>{editError}</Text>}

                  <View style={styles.sheetActions}>
                    <Button title="Cancel" variant="ghost" onPress={closeEdit} />
                    <Button title="Save changes" onPress={onEditSave} />
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: "#0B1220" },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },

  header: { paddingVertical: 6, gap: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#F5F7FF" },
  subtitle: { fontSize: 14, color: "#B8BED0" },

  card: {
    backgroundColor: "#121B2F",
    borderRadius: 18,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  cardTitle: { fontSize: 16, fontWeight: "800", color: "#F5F7FF" },
  label: { fontSize: 12, fontWeight: "700", color: "#B8BED0" },

  input: {
    backgroundColor: "#0F1628",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#F5F7FF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    fontSize: 14,
  },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#0F1628",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  chipSelected: {
    backgroundColor: "#2A3BFF",
    borderColor: "rgba(42,59,255,0.5)",
  },
  chipText: { color: "#D6DAE8", fontWeight: "700", fontSize: 12, textTransform: "capitalize" },
  chipTextSelected: { color: "#FFFFFF" },

  error: { color: "#FF6B6B", fontWeight: "700" },

  btn: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#2A3BFF" },
  btnDanger: { backgroundColor: "#E5484D" },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  btnText: { fontSize: 13, fontWeight: "800" },
  btnTextPrimary: { color: "#FFFFFF" },
  btnTextGhost: { color: "#F5F7FF" },

  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  totalLabel: { color: "#B8BED0", fontSize: 12, fontWeight: "700" },
  totalValue: { color: "#F5F7FF", fontSize: 28, fontWeight: "900", marginTop: 2 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  badgeText: { color: "#D6DAE8", fontWeight: "800", fontSize: 12 },

  mealRow: {
    backgroundColor: "#0F1628",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealName: { color: "#F5F7FF", fontWeight: "900", fontSize: 14 },
  mealMeta: { color: "#B8BED0", marginTop: 2, fontWeight: "700", fontSize: 12 },
  rowButtons: { flexDirection: "row", gap: 8 },

  empty: { paddingVertical: 22, alignItems: "center", gap: 6 },
  emptyTitle: { color: "#F5F7FF", fontWeight: "900" },
  emptyText: { color: "#B8BED0", fontWeight: "700" },

  backdrop: {
    ...Platform.select({ web: { cursor: "default" } }),
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#121B2F",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sheetTitle: { color: "#F5F7FF", fontSize: 18, fontWeight: "900" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "#F5F7FF", fontWeight: "900" },

  sheetActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 6 },
};
