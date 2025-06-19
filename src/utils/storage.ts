export interface SurveyAnswers {
    [key: string]: string | string[] | null;
}

export interface SavedSurveyData {
    answers: SurveyAnswers;
    timestamp: number;
    userId?: string;
    isCompleted: boolean;
    currentQuestionIndex?: number;
}

const STORAGE_KEY = 'survey_data';
const STORAGE_VERSION = '1.0';

export class SurveyStorage {

    static saveAnswers(data: SavedSurveyData): void {
        try {
            const dataWithVersion = {
                ...data,
                version: STORAGE_VERSION,
                timestamp: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithVersion));
            console.log('✅ Answers saved successfully');
        } catch (error) {
            console.error('❌ Error while saving: ', error);
        }
    }

    static getAnswers(): SavedSurveyData | null {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return null;

            const data = JSON.parse(saved);

            if (data.version !== STORAGE_VERSION) {
                console.warn('⚠️ Incompatible data version, delete...');
                this.clearAnswers();
                return null;
            }

            return data;
        } catch (error) {
            console.error('❌ Error while recovering:', error);
            return null;
        }
    }

    static updateAnswers(newAnswers: SavedSurveyData, currentQuestionIndex?: number): void {
        const existing = this.getAnswers();

        const updatedData: SavedSurveyData = {
            answers: { ...existing?.answers, ...newAnswers.answers },
            timestamp: Date.now(),
            isCompleted: existing?.isCompleted || false,
            currentQuestionIndex: currentQuestionIndex ?? existing?.currentQuestionIndex,
            userId: existing?.userId
        };

        this.saveAnswers(updatedData);
    }

    static markAsCompleted(finalAnswers: SurveyAnswers): void {
        const data: SavedSurveyData = {
            answers: finalAnswers,
            timestamp: Date.now(),
            isCompleted: true
        };

        this.saveAnswers(data);
    }

    static hasInProgressQuestionnaire(): boolean {
        const saved = this.getAnswers();
        return saved !== null && !saved.isCompleted;
    }

    static hasCompletedQuestionnaire(): boolean {
        const saved = this.getAnswers();
        return saved !== null && saved.isCompleted;
    }

    static clearAnswers(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('🗑️ Deleted data');
        } catch (error) {
            console.error('❌ Error while deleting:', error);
        }
    }

    static exportData(): string | null {
        const data = this.getAnswers();
        return data ? JSON.stringify(data, null, 2) : null;
    }

    static importData(jsonData: string): boolean {
        try {
            const data = JSON.parse(jsonData);
            this.saveAnswers(data);
            return true;
        } catch (error) {
            console.error('❌ Error while importing:', error);
            return false;
        }
    }

    static getStats(): {
        hasData: boolean;
        isCompleted: boolean;
        answersCount: number;
        lastUpdated: Date | null;
    } {
        const saved = this.getAnswers();

        if (!saved) {
            return {
                hasData: false,
                isCompleted: false,
                answersCount: 0,
                lastUpdated: null
            };
        }

        return {
            hasData: true,
            isCompleted: saved.isCompleted,
            answersCount: Object.keys(saved.answers).length,
            lastUpdated: new Date(saved.timestamp)
        };
    }
}